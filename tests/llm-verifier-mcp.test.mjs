import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const server = join(root, "plugins/llm-as-a-verifier/mcp/server.py");

function rpc(method, params, id = 1) {
  return `${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`;
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

function parseLineResults(stdout) {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("{"))
    .map((line) => JSON.parse(line));
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
});
