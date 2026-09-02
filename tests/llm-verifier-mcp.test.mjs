import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const server = join(root, "plugins/llm-as-a-verifier/mcp/server.py");
const fakeVerifier = join(root, "tests/fixtures/fake-llm-verifier");

function rpc(method, params, id = 1) {
  return `${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`;
}

function contentLengthFrame(obj) {
  const body = JSON.stringify(obj);
  return `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`;
}

function parseLineResults(stdout) {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("{"))
    .map((line) => JSON.parse(line));
}

function parseContentLengthResults(stdout) {
  const messages = [];
  let rest = stdout;
  while (true) {
    const match = rest.match(/Content-Length:\s*(\d+)\r\n\r\n/i);
    if (!match) break;
    const length = Number(match[1]);
    const start = match.index + match[0].length;
    const body = rest.slice(start, start + length);
    if (body.length < length) break;
    messages.push(JSON.parse(body));
    rest = rest.slice(start + length);
  }
  return messages;
}

async function callMcp(messages, env = {}) {
  return await new Promise((resolve, reject) => {
    const child = spawn("python3", [server], {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
    for (const message of messages) {
      child.stdin.write(message);
    }
    child.stdin.end();
    setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`MCP server timed out\n${stdout}\n${stderr}`));
    }, 15000).unref();
  });
}

function waitFor(predicate, timeoutMs, label) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const value = predicate();
      if (value) {
        resolve(value);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error(label));
        return;
      }
      setTimeout(tick, 20);
    };
    tick();
  });
}

async function withOpenStdin(env, fn) {
  const child = spawn("python3", [server], {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  const timeout = setTimeout(() => {
    child.kill("SIGKILL");
  }, 8000);
  try {
    await fn({
      child,
      stdoutOf: () => stdout,
      stderrOf: () => stderr,
    });
  } finally {
    clearTimeout(timeout);
    if (!child.killed) {
      child.stdin.end();
      child.kill("SIGTERM");
    }
  }
}

describe("llm-as-a-verifier MCP", () => {
  it("lists select, compare, and track", async () => {
    const { code, stdout, stderr } = await callMcp(
      [
        rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } }),
        rpc("tools/list", {}, 2),
      ],
      { LLM_VERIFIER_TEST_UNAVAILABLE: "1" },
    );
    assert.equal(code, 0, stderr);
    const messages = parseLineResults(stdout);
    const listed = messages.find((msg) => msg.id === 2);
    assert.ok(listed, `no tools/list result in ${stdout}`);
    const names = listed.result.tools.map((tool) => tool.name).sort();
    assert.deepEqual(names, ["compare", "select", "track"]);
  });

  it("fails clearly when llm-verifier is not installed", async () => {
    const { code, stdout, stderr } = await callMcp(
      [
        rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } }),
        rpc(
          "tools/call",
          {
            name: "select",
            arguments: {
              problem: "reverse a string",
              candidates: ["a", "b"],
              criteria: { Correctness: "Does it reverse?" },
            },
          },
          2,
        ),
      ],
      { LLM_VERIFIER_TEST_UNAVAILABLE: "1" },
    );
    assert.equal(code, 0, stderr);
    const messages = parseLineResults(stdout);
    const result = messages.find((msg) => msg.id === 2);
    assert.ok(result, `no tools/call result in ${stdout}`);
    assert.equal(result.result.isError, true);
    assert.match(result.result.content[0].text, /pip install llm-verifier/);
  });

  it("fails clearly when no logprob API key is set", async () => {
    const { code, stdout, stderr } = await callMcp(
      [
        rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } }),
        rpc(
          "tools/call",
          {
            name: "select",
            arguments: {
              problem: "reverse a string",
              candidates: ["a", "b"],
              criteria: { Correctness: "Does it reverse?" },
            },
          },
          2,
        ),
      ],
      {
        PYTHONPATH: fakeVerifier,
        DEEPSEEK_API_KEY: "",
        VERTEX_API_KEY: "",
        OPENAI_BASE_URL: "",
        OPENAI_API_KEY: "",
        LLM_VERIFIER_TEST_UNAVAILABLE: "",
      },
    );
    assert.equal(code, 0, stderr);
    const messages = parseLineResults(stdout);
    const result = messages.find((msg) => msg.id === 2);
    assert.ok(result, `no tools/call result in ${stdout}`);
    assert.equal(result.result.isError, true);
    assert.match(result.result.content[0].text, /DEEPSEEK_API_KEY|VERTEX_API_KEY|OPENAI_BASE_URL/);
  });

  it("replies on a persistent stdin (newline and Content-Length)", async () => {
    await withOpenStdin({ LLM_VERIFIER_TEST_UNAVAILABLE: "1" }, async ({ child, stdoutOf, stderrOf }) => {
      child.stdin.write(
        rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } }),
      );
      const listedInit = await waitFor(
        () => parseLineResults(stdoutOf()).find((msg) => msg.id === 1),
        3000,
        `no initialize reply before EOF\n${stdoutOf()}\n${stderrOf()}`,
      );
      assert.equal(listedInit.result.serverInfo.name, "llm-as-a-verifier");
      child.stdin.write(rpc("tools/list", {}, 2));
      const listed = await waitFor(
        () => parseLineResults(stdoutOf()).find((msg) => msg.id === 2),
        3000,
        `no tools/list reply before EOF\n${stdoutOf()}\n${stderrOf()}`,
      );
      assert.deepEqual(listed.result.tools.map((tool) => tool.name).sort(), ["compare", "select", "track"]);
    });

    await withOpenStdin({ LLM_VERIFIER_TEST_UNAVAILABLE: "1" }, async ({ child, stdoutOf, stderrOf }) => {
      child.stdin.write(
        contentLengthFrame({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } },
        }),
      );
      const init = await waitFor(
        () => parseContentLengthResults(stdoutOf()).find((msg) => msg.id === 1),
        3000,
        `no Content-Length initialize reply\n${stdoutOf()}\n${stderrOf()}`,
      );
      assert.equal(init.result.serverInfo.name, "llm-as-a-verifier");
    });
  });

  it("forwards select, compare, and track to llm_verifier", async () => {
    const dir = mkdtempSync(join(tmpdir(), "llm-verifier-log-"));
    const logPath = join(dir, "calls.jsonl");
    try {
      const { code, stdout, stderr } = await callMcp(
        [
          rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } }),
          rpc(
            "tools/call",
            {
              name: "select",
              arguments: {
                problem: "reverse a string",
                candidates: ["s[::-1]", "s"],
                criteria: { Correctness: "Does it reverse?" },
              },
            },
            2,
          ),
          rpc(
            "tools/call",
            {
              name: "compare",
              arguments: {
                problem: "reverse a string",
                trace_a: "s[::-1]",
                trace_b: "s",
                criteria: { Overall: "solves it" },
              },
            },
            3,
          ),
          rpc(
            "tools/call",
            {
              name: "track",
              arguments: {
                problem: "reverse a string",
                steps: ["wrote s[::-1]", "tested abc"],
              },
            },
            4,
          ),
        ],
        {
          PYTHONPATH: fakeVerifier,
          DEEPSEEK_API_KEY: "test",
          LLM_VERIFIER_TEST_LOG: logPath,
          LLM_VERIFIER_TEST_UNAVAILABLE: "",
        },
      );
      assert.equal(code, 0, stderr);
      const messages = parseLineResults(stdout);
      const selectResult = messages.find((msg) => msg.id === 2);
      const compareResult = messages.find((msg) => msg.id === 3);
      const trackResult = messages.find((msg) => msg.id === 4);
      assert.equal(selectResult.result.isError, false, stdout);
      assert.equal(compareResult.result.isError, false, stdout);
      assert.equal(trackResult.result.isError, false, stdout);
      const selectPayload = JSON.parse(selectResult.result.content[0].text);
      const comparePayload = JSON.parse(compareResult.result.content[0].text);
      const trackPayload = JSON.parse(trackResult.result.content[0].text);
      assert.equal(selectPayload.index, 0);
      assert.equal(comparePayload.reward_a, 0.8);
      assert.ok(Array.isArray(trackPayload.scores));
      const calls = readFileSync(logPath, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      const names = calls.map((call) => call.name).sort();
      assert.deepEqual(names, ["compare", "select", "track"]);
      const selectCall = calls.find((call) => call.name === "select");
      assert.equal(selectCall.problem, "reverse a string");
      assert.deepEqual(selectCall.candidates, ["s[::-1]", "s"]);
      const compareCall = calls.find((call) => call.name === "compare");
      assert.equal(compareCall.trace_a, "s[::-1]");
      assert.equal(compareCall.trace_b, "s");
      const trackCall = calls.find((call) => call.name === "track");
      assert.deepEqual(trackCall.steps, ["wrote s[::-1]", "tested abc"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
