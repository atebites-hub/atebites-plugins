import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const EXPECTED_PLUGINS = [
  "open-dynamic-workflows",
  "ponytail",
  "sol-advisor",
  "taskboard",
  "j-space",
  "llm-as-a-verifier",
];

const FORBIDDEN_SOURCE_HOSTS = [
  "DietrichGebert",
  "imsai-sh",
  "tcarac/taskboard",
  "xz1220",
];

function readJson(relPath) {
  const full = join(root, relPath);
  assert.equal(existsSync(full), true, `missing ${relPath}`);
  return JSON.parse(readFileSync(full, "utf8"));
}

function sourceText(source) {
  return JSON.stringify(source);
}

function assertLocalSource(pluginName, source) {
  const text = sourceText(source);
  assert.equal(
    /https?:\/\//i.test(text),
    false,
    `${pluginName} source must be a local path, got ${text}`,
  );
  for (const host of FORBIDDEN_SOURCE_HOSTS) {
    assert.equal(
      text.includes(host),
      false,
      `${pluginName} source must not point at ${host}: ${text}`,
    );
  }
}

function pluginNames(marketplace) {
  assert.ok(Array.isArray(marketplace.plugins), "plugins must be an array");
  return marketplace.plugins.map((p) => p.name);
}

function assertCatalogPlugins(marketplace, label) {
  const names = pluginNames(marketplace);
  assert.deepEqual(
    [...names].sort(),
    [...EXPECTED_PLUGINS].sort(),
    `${label} must list exactly ${EXPECTED_PLUGINS.join(", ")}`,
  );
}

function resolveLocalPath(source) {
  if (typeof source === "string") {
    return source.replace(/^\.\//, "");
  }
  if (source && typeof source === "object") {
    const path = source.path;
    assert.equal(typeof path, "string", `local source missing path: ${JSON.stringify(source)}`);
    return path.replace(/^\.\//, "");
  }
  assert.fail(`unsupported source: ${JSON.stringify(source)}`);
}

describe("Cursor marketplace", () => {
  it("validates against the official schema via the catalog validator", () => {
    const result = spawnSync(process.execPath, [join(root, "scripts/validate-marketplace.mjs")], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /ok/i);
  });

  it("lists six in-repo plugins with only name, source, and description", () => {
    const marketplace = readJson(".cursor-plugin/marketplace.json");
    assert.equal(marketplace.name, "atebites-plugins");
    assert.equal(marketplace.owner?.name, "atebites-hub");
    assertCatalogPlugins(marketplace, "Cursor");
    for (const entry of marketplace.plugins) {
      assert.deepEqual(
        Object.keys(entry).sort(),
        ["description", "name", "source"],
        `${entry.name} Cursor entry keys`,
      );
      assert.equal(typeof entry.source, "string");
      assertLocalSource(entry.name, entry.source);
      const pluginJson = join(root, entry.source, ".cursor-plugin/plugin.json");
      assert.equal(
        existsSync(pluginJson),
        true,
        `Cursor source ${entry.source} must contain .cursor-plugin/plugin.json`,
      );
      const manifest = JSON.parse(readFileSync(pluginJson, "utf8"));
      assert.equal(manifest.name, entry.name);
    }
  });
});

describe("Grok, Claude, Codex, and ZCode catalogs", () => {
  it("Grok marketplace uses local path objects for all six plugins", () => {
    const marketplace = readJson(".grok-plugin/marketplace.json");
    assertCatalogPlugins(marketplace, "Grok");
    for (const entry of marketplace.plugins) {
      assert.equal(entry.source?.type, "local", `${entry.name} Grok source.type`);
      assertLocalSource(entry.name, entry.source);
      const rel = resolveLocalPath(entry.source);
      assert.equal(existsSync(join(root, rel)), true, `Grok path missing: ${rel}`);
    }
  });

  it("Claude marketplace matches the Anthropic path-source shape", () => {
    const marketplace = readJson(".claude-plugin/marketplace.json");
    assert.ok(marketplace.$schema, "Claude marketplace needs $schema");
    assertCatalogPlugins(marketplace, "Claude");
    for (const entry of marketplace.plugins) {
      assert.equal(typeof entry.source, "string", `${entry.name} Claude source must be a path`);
      assert.match(entry.source, /^\.\//, `${entry.name} Claude source must start with ./`);
      assertLocalSource(entry.name, entry.source);
      const rel = resolveLocalPath(entry.source);
      assert.equal(existsSync(join(root, rel)), true, `Claude path missing: ${rel}`);
    }
  });

  it("Codex marketplace uses local sources, not remote git URLs", () => {
    const marketplace = readJson(".agents/plugins/marketplace.json");
    assertCatalogPlugins(marketplace, "Codex");
    for (const entry of marketplace.plugins) {
      assert.equal(entry.source?.source, "local", `${entry.name} Codex source.source`);
      assertLocalSource(entry.name, entry.source);
      const rel = resolveLocalPath(entry.source);
      assert.equal(existsSync(join(root, rel)), true, `Codex path missing: ${rel}`);
    }
  });

  it("ZCode marketplace lists all six with local path sources", () => {
    const marketplace = readJson("marketplace.json");
    assertCatalogPlugins(marketplace, "ZCode");
    for (const entry of marketplace.plugins) {
      assert.equal(typeof entry.source, "string", `${entry.name} ZCode source must be a path`);
      assertLocalSource(entry.name, entry.source);
      const rel = resolveLocalPath(entry.source);
      assert.equal(existsSync(join(root, rel)), true, `ZCode path missing: ${rel}`);
    }
  });
});

describe("README product surface", () => {
  it("documents install commands for six plugins and the wrapped-framework note", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    for (const name of EXPECTED_PLUGINS) {
      assert.match(readme, new RegExp(name), `README must mention ${name}`);
    }
    assert.match(readme, /atebites-hub forks/i);
    assert.match(readme, /Import from Repo/);
    assert.match(readme, /grok plugin marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /\/plugin marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /codex plugin marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /\/plugins marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /hermes plugins install atebites-hub\/ponytail/);
    assert.match(readme, /pi install git:github.com\/atebites-hub\/ponytail/);
    assert.match(
      readme,
      /https:\/\/github.com\/llm-as-a-verifier\/llm-as-a-verifier/,
    );
    assert.match(readme, /https:\/\/github.com\/llm-as-a-verifier\/TurboAgent/);
    assert.match(readme, /grok plugin install llm-as-a-verifier --trust/);
    assert.match(readme, /\/plugin install llm-as-a-verifier@atebites-plugins/);
    assert.match(readme, /codex plugin add llm-as-a-verifier@atebites-plugins/);
    assert.match(readme, /\/plugins install llm-as-a-verifier/);
    assert.match(readme, /agent --plugin-dir "\$PWD\/plugins\/llm-as-a-verifier"/);
    assert.match(readme, /wrapped framework/i);
    assert.match(readme, /not an upstream/i);
    assert.doesNotMatch(readme, /DietrichGebert\/ponytail/);
    assert.doesNotMatch(readme, /Do not add it to this marketplace/);
  });
});

describe("llm-as-a-verifier wrap", () => {
  it("ships a skill that teaches ODW use, MCP tools, and no always-on hooks", () => {
    const pluginRoot = join(root, "plugins/llm-as-a-verifier");
    const skill = join(pluginRoot, "skills/llm-as-a-verifier/SKILL.md");
    assert.equal(existsSync(skill), true, "missing llm-as-a-verifier SKILL.md");
    const text = readFileSync(skill, "utf8");
    assert.match(text, /high-stakes/i);
    assert.match(text, /best-of-N/i);
    assert.match(text, /llm_verifier\.select/);
    assert.match(text, /turbo-agent/);
    assert.match(text, /odw_verifier/);
    assert.match(text, /Advisor/);
    assert.match(text, /logprob/);
    assert.match(text, /DEEPSEEK_API_KEY|VERTEX_API_KEY/);
    assert.match(text, /\bselect\b/);
    assert.match(text, /\bcompare\b/);
    assert.match(text, /\btrack\b/);
    assert.doesNotMatch(text, /SessionStart/);
    const manifest = JSON.parse(
      readFileSync(join(pluginRoot, ".cursor-plugin/plugin.json"), "utf8"),
    );
    assert.equal(manifest.name, "llm-as-a-verifier");
    assert.ok(manifest.mcpServers, "Cursor plugin must declare MCP");
    assert.equal(manifest.hooks, undefined, "no always-on hooks on the Cursor plugin");
    assert.equal(
      existsSync(join(pluginRoot, "hooks/hooks.json")),
      false,
      "must not ship a default hooks/hooks.json",
    );
    assert.equal(existsSync(join(pluginRoot, "mcp.json")), true);
    assert.equal(existsSync(join(pluginRoot, "mcp/server.py")), true);
    const cursorMcp = JSON.parse(readFileSync(join(pluginRoot, "mcp.json"), "utf8"));
    assert.match(JSON.stringify(cursorMcp), /\$\{PLUGIN_ROOT\}\/mcp\/server\.py/);
    const grokMcp = JSON.parse(readFileSync(join(pluginRoot, ".grok-plugin/mcp.json"), "utf8"));
    assert.match(JSON.stringify(grokMcp), /\$\{GROK_PLUGIN_ROOT\}\/mcp\/server\.py/);
    const claudePlugin = JSON.parse(
      readFileSync(join(pluginRoot, ".claude-plugin/plugin.json"), "utf8"),
    );
    assert.match(JSON.stringify(claudePlugin.mcpServers), /\$\{CLAUDE_PLUGIN_ROOT\}\/mcp\/server\.py/);
    const zcodeMcp = JSON.parse(readFileSync(join(pluginRoot, ".mcp.json"), "utf8"));
    assert.match(JSON.stringify(zcodeMcp), /\$\{ZCODE_PLUGIN_ROOT\}\/mcp\/server\.py/);
    const codexMcp = JSON.parse(readFileSync(join(pluginRoot, ".codex-mcp.json"), "utf8"));
    assert.equal(codexMcp.mcpServers["llm-as-a-verifier"].args[0], "./mcp/server.py");
    assert.equal(
      existsSync(join(pluginRoot, "vendor/llm-as-a-verifier")),
      false,
      "do not submodule the framework (benchmark data dump)",
    );
    assert.equal(
      existsSync(join(pluginRoot, "vendor/turbo-agent")),
      false,
      "TurboAgent is pip/proxy, not a catalog submodule",
    );
  });
});
