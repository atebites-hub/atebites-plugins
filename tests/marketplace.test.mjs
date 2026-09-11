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
  "advisor",
  "taskboard",
  "j-space",
  "superpowers",
  "factory-policy",
  "gitnexus",
];

const CLAUDE_LOCAL_SOURCES = {
  "j-space": "./plugins/j-space",
  "factory-policy": "./plugins/factory-policy",
  gitnexus: "./plugins/gitnexus",
};

/** Catalog slug → allowed plugin.json names (sol-advisor until productize). */
const MANIFEST_NAMES = {
  advisor: ["advisor", "sol-advisor"],
};

const SUPERPOWERS_PIN_SHA = "b36e0829c6d0140e93cfef2ca599b1b07d4a7797";
const SUPERPOWERS_CLAUDE_SOURCE = {
  source: "github",
  repo: "obra/superpowers",
  ref: "v6.3.0",
  sha: SUPERPOWERS_PIN_SHA,
};

const FORBIDDEN_SOURCE_HOSTS = [
  "DietrichGebert",
  "imsai-sh",
  "tcarac/taskboard",
  "xz1220",
];

const CLAUDE_GITHUB_REPOS = {
  ponytail: "atebites-hub/ponytail",
  advisor: "atebites-hub/advisor",
  taskboard: "atebites-hub/taskboard",
};

function assertNativeOdw(source, host) {
  assert.deepEqual(source, {
    source: "git-subdir",
    url: "https://github.com/atebites-hub/open-dynamic-workflows-plugin.git",
    path: `./native/${host}/open-dynamic-workflows`,
    sha: "ab6b611268cc9fd752e4e377ab25e909c5a0e23d",
  });
}

function readJson(relPath) {
  const full = join(root, relPath);
  assert.equal(existsSync(full), true, `missing ${relPath}`);
  return JSON.parse(readFileSync(full, "utf8"));
}

function sourceText(source) {
  return JSON.stringify(source);
}

function assertForbiddenSourceHosts(pluginName, source) {
  const text = sourceText(source);
  for (const host of FORBIDDEN_SOURCE_HOSTS) {
    assert.equal(
      text.includes(host),
      false,
      `${pluginName} source must not point at ${host}: ${text}`,
    );
  }
}

function assertLocalSource(pluginName, source) {
  const text = sourceText(source);
  assert.equal(
    /https?:\/\//i.test(text),
    false,
    `${pluginName} source must be a local path, got ${text}`,
  );
  assertForbiddenSourceHosts(pluginName, source);
}

function assertClaudeSource(pluginName, source) {
  assertForbiddenSourceHosts(pluginName, source);
  if (pluginName === "open-dynamic-workflows") {
    assertNativeOdw(source, "claude");
    return;
  }
  const localSource = CLAUDE_LOCAL_SOURCES[pluginName];
  if (localSource) {
    assert.equal(
      source,
      localSource,
      `${pluginName} Claude source must stay the in-repo wrap, got ${sourceText(source)}`,
    );
    const pluginJson = join(root, localSource.replace(/^\.\//, ""), ".claude-plugin/plugin.json");
    assert.equal(
      existsSync(pluginJson),
      true,
      `${localSource}/.claude-plugin/plugin.json must exist`,
    );
    const manifest = JSON.parse(readFileSync(pluginJson, "utf8"));
    assert.equal(manifest.name, pluginName);
    return;
  }
  if (pluginName === "superpowers") {
    assert.deepEqual(
      source,
      SUPERPOWERS_CLAUDE_SOURCE,
      "superpowers Claude source must pin obra/superpowers @ v6.3.0",
    );
    return;
  }
  const expectedRepo = CLAUDE_GITHUB_REPOS[pluginName];
  assert.ok(expectedRepo, `unexpected Claude plugin ${pluginName}`);
  assert.deepEqual(
    source,
    { source: "github", repo: expectedRepo },
    `${pluginName} Claude source must be the atebites-hub GitHub plugin source`,
  );
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

  it("lists catalog plugins with only name, source, and description", () => {
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
      const allowed = MANIFEST_NAMES[entry.name] ?? [entry.name];
      assert.equal(
        allowed.includes(manifest.name),
        true,
        `${entry.name} plugin.json name is ${manifest.name} (allowed ${allowed.join(", ")})`,
      );
    }
  });
});

describe("Grok, Claude, Codex, and ZCode catalogs", () => {
  it("Grok marketplace uses local path objects for all catalog plugins", () => {
    const marketplace = readJson(".grok-plugin/marketplace.json");
    assertCatalogPlugins(marketplace, "Grok");
    for (const entry of marketplace.plugins) {
      assert.equal(entry.source?.type, "local", `${entry.name} Grok source.type`);
      assertLocalSource(entry.name, entry.source);
      const rel = resolveLocalPath(entry.source);
      assert.equal(existsSync(join(root, rel)), true, `Grok path missing: ${rel}`);
    }
  });

  it("Claude marketplace uses native-only ODW, pinned skills, and local wraps", () => {
    const marketplace = readJson(".claude-plugin/marketplace.json");
    assert.ok(marketplace.$schema, "Claude marketplace needs $schema");
    assert.equal(marketplace.name, "atebites-plugins");
    assert.equal(marketplace.owner?.name, "atebites-hub");
    assertCatalogPlugins(marketplace, "Claude");
    for (const entry of marketplace.plugins) {
      assertClaudeSource(entry.name, entry.source);
    }
  });

  it("Codex marketplace pins fork sources instead of installing empty gitlink folders", () => {
    const marketplace = readJson(".agents/plugins/marketplace.json");
    assertCatalogPlugins(marketplace, "Codex");
    const forks = {
      superpowers: { url: "https://github.com/obra/superpowers.git", sha: "b36e0829c6d0140e93cfef2ca599b1b07d4a7797" },
      ponytail: { url: "https://github.com/atebites-hub/ponytail.git", sha: "4416c4dc06feef1541f446022670c04c3c014699" },
    };
    for (const entry of marketplace.plugins) {
      if (forks[entry.name]) {
        assert.deepEqual(entry.source, { source: "url", ...forks[entry.name] });
        continue;
      }
      if (entry.name === "open-dynamic-workflows") {
        assertNativeOdw(entry.source, "codex");
        continue;
      }
      assert.equal(entry.source?.source, "local", `${entry.name} Codex source.source`);
      assertLocalSource(entry.name, entry.source);
      const rel = resolveLocalPath(entry.source);
      assert.equal(existsSync(join(root, rel)), true, `Codex path missing: ${rel}`);
      if (entry.name === "advisor") {
        assert.equal(
          rel,
          "plugins/advisor/plugins/sol-advisor",
          "Codex advisor source stays the nested package until productize",
        );
        assert.equal(
          existsSync(join(root, rel, ".codex-plugin/plugin.json")),
          true,
          "Codex advisor nested package must contain .codex-plugin/plugin.json",
        );
      }
    }
  });

  it("ZCode marketplace lists all catalog plugins with local path sources", () => {
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
  it("documents install commands for catalog plugins and keeps verifier out of the catalog", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    for (const name of EXPECTED_PLUGINS) {
      assert.match(readme, new RegExp(name), `README must mention ${name}`);
    }
    assert.match(readme, /atebites-hub forks/i);
    assert.match(readme, /Import from Repo/);
    assert.match(readme, /grok plugin marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /\/plugin marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /\/plugin marketplace update atebites-plugins/);
    assert.match(readme, /without initializing git submodules/i);
    assert.match(readme, /GitHub plugin sources/i);
    assert.match(readme, /codex plugin marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /\/plugins marketplace add atebites-hub\/atebites-plugins/);
    assert.match(readme, /hermes plugins install atebites-hub\/ponytail/);
    assert.match(readme, /pi install git:github.com\/atebites-hub\/ponytail/);
    assert.match(
      readme,
      /https:\/\/github.com\/llm-as-a-verifier\/llm-as-a-verifier/,
    );
    assert.match(readme, /https:\/\/github.com\/llm-as-a-verifier\/TurboAgent/);
    assert.match(readme, /Do not add it to this marketplace/);
    assert.match(readme, /intensity \*\*full\*\* always/);
    assert.match(readme, /never lite/);
    assert.doesNotMatch(readme, /PONYTAIL_DEFAULT_MODE=lite/);
    assert.doesNotMatch(readme, /DietrichGebert\/ponytail/);
    assert.doesNotMatch(readme, /grok plugin install llm-as-a-verifier --trust/);
    assert.doesNotMatch(readme, /\/plugin install llm-as-a-verifier@atebites-plugins/);
    assert.doesNotMatch(readme, /codex plugin add llm-as-a-verifier@atebites-plugins/);
    assert.doesNotMatch(readme, /\/plugins install llm-as-a-verifier/);
    assert.doesNotMatch(readme, /agent --plugin-dir "\$PWD\/plugins\/llm-as-a-verifier"/);
    assert.doesNotMatch(readme, /install all seven/i);
  });
});

describe("Superpowers pin", () => {
  it("vendors obra/superpowers at v6.3.0 without a floating branch", () => {
    const gitmodules = readFileSync(join(root, ".gitmodules"), "utf8");
    const section = gitmodules.match(/\[submodule "plugins\/superpowers"\]([^\[]*)/);
    assert.ok(section, "plugins/superpowers submodule must be listed in .gitmodules");
    assert.match(section[1], /url = https:\/\/github.com\/obra\/superpowers\.git/);
    assert.doesNotMatch(section[1], /^\s*branch\s*=/m);

    const recorded = spawnSync("git", ["ls-files", "-s", "plugins/superpowers"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(recorded.status, 0, recorded.stderr);
    assert.match(recorded.stdout, new RegExp(`160000 ${SUPERPOWERS_PIN_SHA} `));

    const head = spawnSync("git", ["-C", "plugins/superpowers", "rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(head.status, 0, head.stderr);
    assert.equal(head.stdout.trim(), SUPERPOWERS_PIN_SHA);
  });
});

describe("Advisor submodule cutover", () => {
  it("points .gitmodules at atebites-hub/advisor on plugins/advisor", () => {
    const text = readFileSync(join(root, ".gitmodules"), "utf8");
    assert.match(text, /\[submodule "plugins\/advisor"\]/);
    assert.match(text, /path = plugins\/advisor/);
    assert.match(text, /url = https:\/\/github.com\/atebites-hub\/advisor\.git/);
    assert.doesNotMatch(text, /path = plugins\/sol-advisor/);
    assert.doesNotMatch(text, /atebites-hub\/sol-advisor\.git/);
  });

  it("keeps the gitlink at plugins/advisor", () => {
    const result = spawnSync("git", ["ls-files", "-s", "plugins/advisor", "plugins/sol-advisor"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /^160000 [0-9a-f]{40} 0\tplugins\/advisor$/m);
    assert.doesNotMatch(result.stdout, /plugins\/sol-advisor/);
  });
});

describe("llm-as-a-verifier is not a catalog plugin", () => {
  it("does not ship wrap files, MCP tests, or a catalog source tree", () => {
    assert.equal(
      existsSync(join(root, "plugins/llm-as-a-verifier")),
      false,
      "plugins/llm-as-a-verifier must be deleted",
    );
    assert.equal(
      existsSync(join(root, "tests/llm-verifier-mcp.test.mjs")),
      false,
      "tests/llm-verifier-mcp.test.mjs must be deleted",
    );
    assert.equal(
      existsSync(join(root, "tests/fixtures/fake-llm-verifier")),
      false,
      "tests/fixtures/fake-llm-verifier must be deleted",
    );
  });
});
