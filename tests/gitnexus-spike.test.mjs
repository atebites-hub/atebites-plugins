import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(root, "plugins/gitnexus");

const PIN_VERSION = "1.6.7";
const PIN_GITHEAD = "1cf65b339c8acfc1a27f5c9463c52e4604079fbd";
const LATEST_STABLE = "1.6.11";
const LATEST_GITHEAD = "c0c3fa18a9b27d210099f908095fec373dd3d2d5";
const MONOREPO_HEAD = "a049b2dac6433b3c13185e226483fa85743dab1e";

const CATALOGS = [
  ".cursor-plugin/marketplace.json",
  ".grok-plugin/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "marketplace.json",
];

const HOST_MANIFESTS = [
  "plugin.json",
  ".cursor-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".grok-plugin/plugin.json",
  ".zcode-plugin/plugin.json",
];

const SECRET_PATTERNS = [
  /GITHUB_TOKEN/,
  /OPENAI_API_KEY/,
  /Authorization:\s*Bearer/i,
  /"apiKey"\s*:/,
];

function read(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

function catalogEntry(relPath, name) {
  const marketplace = JSON.parse(read(relPath));
  return (marketplace.plugins || []).find((plugin) => plugin.name === name);
}

function catalogSourcePath(entry) {
  const source = entry?.source;
  if (typeof source === "string") return source;
  if (source && typeof source === "object" && typeof source.path === "string") {
    return source.path;
  }
  return "";
}

describe("gitnexus P2 wrap (catalog-listed, not a Factory default)", () => {
  it("is present in every host marketplace catalog with non-default wording", () => {
    for (const rel of CATALOGS) {
      const entry = catalogEntry(rel, "gitnexus");
      assert.ok(entry, `${rel} must list gitnexus`);
      assert.match(
        catalogSourcePath(entry),
        /(?:^\.\/)?plugins\/gitnexus$/,
        `${rel} gitnexus source must be the in-repo wrap path`,
      );
      const text = JSON.stringify(entry);
      assert.match(text, /not a Factory default/i, `${rel} must say not a Factory default`);
      assert.match(text, /P N|pin install/i, `${rel} must say P N or pin install`);
      assert.doesNotMatch(
        text,
        /Factory-required|factory-default pin|Factory default pin/i,
        `${rel} must not claim Factory-default beyond installability`,
      );
    }
    const pluginJson = JSON.parse(read("plugins/gitnexus/plugin.json"));
    assert.equal(pluginJson.version, "0.1.0");
    assert.match(pluginJson.description, /catalog-listed for pin install/i);
    assert.match(pluginJson.description, /not a Factory default/i);
    assert.match(pluginJson.description, /gitnexus@1\.6\.7/);
    assert.doesNotMatch(pluginJson.description, /Not catalog-listed/);
  });

  it("does not appear in the Factory story kept list", () => {
    const index = read("docs/FORK-INDEX.md");
    const keptBlock = index.split("Discarded from Factory")[0];
    assert.match(keptBlock, /Kept in the Factory story/);
    assert.doesNotMatch(keptBlock, /gitnexus/);
    assert.doesNotMatch(keptBlock, /GitNexus/);
    assert.match(index, /Upcoming \/ P2 spike/);
    assert.match(index, /plugins\/gitnexus/);
    assert.match(index, /SPIKE-GITNEXUS\.md/);
    assert.match(index, /gitnexus@atebites-plugins/);
    assert.match(index, /not factory-default/i);
    assert.match(index, /enabledPlugins/);
  });

  it("ships the wrap with SPIKE labels and the pinned MCP command", () => {
    assert.equal(existsSync(join(pluginRoot, "README.md")), true);
    const readme = readFileSync(join(pluginRoot, "README.md"), "utf8");
    assert.match(readme, /SPIKE/);
    assert.match(readme, /not a Factory default/i);
    assert.match(readme, /catalog-listed for pin install/i);
    assert.match(readme, /upcoming/i);
    assert.match(readme, /\*\*P N\*\*|\/ P N \//);
    assert.match(readme, new RegExp(`gitnexus@${PIN_VERSION}`));
    assert.match(readme, /gitnexus@atebites-plugins/);
    assert.match(readme, /enabledPlugins/);
    assert.doesNotMatch(readme, /HARD PASS/);
    assert.doesNotMatch(readme, /Lane B PASS/);

    const mcp = JSON.parse(readFileSync(join(pluginRoot, "mcp.json"), "utf8"));
    const claudeMcp = JSON.parse(readFileSync(join(pluginRoot, ".mcp.json"), "utf8"));
    assert.deepEqual(mcp, claudeMcp, "mcp.json and .mcp.json must stay identical");
    assert.deepEqual(mcp, {
      mcpServers: {
        gitnexus: {
          command: "npx",
          args: ["-y", `gitnexus@${PIN_VERSION}`, "mcp"],
        },
      },
    });
    const mcpText = JSON.stringify(mcp);
    assert.doesNotMatch(mcpText, /@latest/);
    assert.doesNotMatch(mcpText, new RegExp(`gitnexus@${LATEST_STABLE}`));
  });

  it("records the npm pin, latest-not-selected, and no-fork rationale", () => {
    const spike = read("docs/SPIKE-GITNEXUS.md");
    assert.match(spike, /SPIKE/);
    assert.match(spike, /no soft-pass/i);
    assert.match(spike, /\*\*P N\*\*/);
    assert.match(spike, /D-GITNEXUS|MASTER-PLAN/);
    assert.match(spike, /not a Factory default/i);
    assert.match(spike, /catalog-listed for pin install/i);
    assert.match(spike, new RegExp(`gitnexus@${PIN_VERSION}`));
    assert.match(spike, new RegExp(PIN_GITHEAD));
    assert.match(spike, new RegExp(LATEST_STABLE));
    assert.match(spike, /not selected|Pin stays/);
    assert.match(spike, /enabledPlugins/);
    assert.match(spike, /double-spawn|template/);
    assert.match(spike, /PolyForm/);
    assert.match(spike, /No CE|CE \/ taskboard|taskboard \/ j-space/);
    assert.match(spike, /Lane B/);
    assert.doesNotMatch(spike, /HARD PASS/);
    assert.match(spike, /do not true-fork|Do not create it|why not a full fork/i);

    const upstream = readFileSync(join(pluginRoot, "UPSTREAM.md"), "utf8");
    assert.match(upstream, /https:\/\/github\.com\/abhigyanpatwari\/GitNexus/);
    assert.match(upstream, /npmjs\.com\/package\/gitnexus/);
    assert.match(upstream, new RegExp(PIN_VERSION));
    assert.match(upstream, new RegExp(PIN_GITHEAD));
    assert.match(upstream, new RegExp(LATEST_STABLE));
    assert.match(upstream, new RegExp(LATEST_GITHEAD));
    assert.match(upstream, new RegExp(MONOREPO_HEAD));
    assert.match(upstream, /PolyForm-Noncommercial-1\.0\.0|PolyForm Noncommercial/);
    assert.match(upstream, /do not fork yet/i);
    assert.match(upstream, /gitnexus-claude-plugin/);
    assert.match(upstream, /gitnexus-cursor-integration/);
    assert.match(upstream, /@latest/);
    assert.match(upstream, /Lane B awaiting Jay credentials/);
    assert.match(upstream, /atebites-hub\/gitnexus/);
    assert.match(upstream, /404/);
    assert.doesNotMatch(upstream, /HARD PASS/);

    const notice = readFileSync(join(pluginRoot, "NOTICE"), "utf8");
    assert.match(notice, /PolyForm/);
    assert.match(notice, /Abhigyan Patwari/);
    assert.match(notice, new RegExp(PIN_VERSION));

    const gitmodules = existsSync(join(root, ".gitmodules")) ? read(".gitmodules") : "";
    assert.doesNotMatch(gitmodules, /gitnexus/);
    assert.doesNotMatch(gitmodules, /abhigyanpatwari\/GitNexus/);
  });

  it("ships thin host plugin.json files without secrets or @latest", () => {
    for (const rel of HOST_MANIFESTS) {
      const path = join(pluginRoot, rel);
      assert.equal(existsSync(path), true, `missing ${rel}`);
      const text = readFileSync(path, "utf8");
      const json = JSON.parse(text);
      assert.equal(json.name, "gitnexus");
      assert.equal(json.version, "0.1.0");
      assert.match(json.description, /not a Factory default/i);
      assert.doesNotMatch(text, /gitnexus@latest/);
      for (const pattern of SECRET_PATTERNS) {
        assert.doesNotMatch(text, pattern, `${rel} must not invent secrets`);
      }
    }

    const cursor = JSON.parse(readFileSync(join(pluginRoot, ".cursor-plugin/plugin.json"), "utf8"));
    assert.equal(cursor.mcpServers, "./mcp.json");
    const grok = JSON.parse(readFileSync(join(pluginRoot, ".grok-plugin/plugin.json"), "utf8"));
    assert.equal(grok.mcpServers, "./mcp.json");
    const claude = JSON.parse(readFileSync(join(pluginRoot, ".claude-plugin/plugin.json"), "utf8"));
    assert.equal(claude.mcpServers, "./mcp.json");
  });

  it("README Upcoming section lists the pin without Factory-default install commands", () => {
    const readme = read("README.md");
    assert.match(readme, /Upcoming \/ P2 spike/);
    assert.match(readme, /plugins\/gitnexus/);
    assert.match(readme, /docs\/SPIKE-GITNEXUS\.md/);
    assert.match(readme, /gitnexus@atebites-plugins/);
    assert.match(readme, /not a Factory default/i);
    assert.match(readme, /enabledPlugins/);
    assert.match(readme, /1\.6\.7/);
    assert.doesNotMatch(readme, /grok plugin install gitnexus --trust/);
    assert.doesNotMatch(readme, /\/plugin install gitnexus@atebites-plugins/);
    assert.doesNotMatch(readme, /codex plugin add gitnexus@atebites-plugins/);
    assert.doesNotMatch(readme, /\/plugins install gitnexus/);
  });
});
