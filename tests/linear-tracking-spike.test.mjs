import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(root, "plugins/linear-tracking");

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
  /LINEAR_API_KEY/,
  /lin_api_/,
  /Authorization:\s*Bearer/i,
  /"apiKey"\s*:/,
];

function read(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

function catalogNames(relPath) {
  const marketplace = JSON.parse(read(relPath));
  return (marketplace.plugins || []).map((plugin) => plugin.name);
}

describe("linear-tracking P2 spike (not a catalog / Factory default)", () => {
  it("is absent from every host marketplace catalog", () => {
    for (const rel of CATALOGS) {
      const names = catalogNames(rel);
      assert.equal(
        names.includes("linear-tracking"),
        false,
        `${rel} must not list linear-tracking (spike is non-default)`,
      );
    }
  });

  it("does not appear in the Factory story kept list", () => {
    const index = read("docs/FORK-INDEX.md");
    const keptBlock = index.split("Discarded from Factory")[0];
    assert.match(keptBlock, /Kept in the Factory story/);
    assert.doesNotMatch(keptBlock, /linear-tracking/);
    assert.match(index, /Upcoming \/ P2 spike/);
    assert.match(index, /plugins\/linear-tracking/);
    assert.match(index, /SPIKE-LINEAR-TRACKING\.md/);
  });

  it("ships the inline stub with SPIKE labels and placement skill", () => {
    assert.equal(existsSync(join(pluginRoot, "README.md")), true);
    const readme = readFileSync(join(pluginRoot, "README.md"), "utf8");
    assert.match(readme, /SPIKE/);
    assert.match(readme, /not a Factory default/i);
    assert.match(readme, /[Nn]ot catalog-listed/);
    assert.match(readme, /upcoming/i);
    assert.match(readme, /[Dd]o not claim Linear Agent skills installed/);

    const skillPath = join(pluginRoot, "skills/linear-tracking/SKILL.md");
    assert.equal(existsSync(skillPath), true);
    const skill = readFileSync(skillPath, "utf8");
    assert.match(skill, /^name: linear-tracking$/m);
    assert.match(skill, /list_issues/);
    assert.match(skill, /list_my_issues/);
    assert.match(skill, /get_issue/);
    assert.match(skill, /Closes BLA-n/);
    assert.match(skill, /[Ss]ession start/);
    assert.match(skill, /auto-delegate|auto-assign/);
    assert.match(skill, /fail closed/);
    assert.match(skill, /linear-driven-flow\.md/);
    assert.match(skill, /does not\s+install Linear Agent/);
    assert.doesNotMatch(skill, /Linear Agent skills are installed/);
  });

  it("names ownership, vendor-pin strategy, and required behaviors", () => {
    const spike = read("docs/SPIKE-LINEAR-TRACKING.md");
    assert.match(spike, /SPIKE/);
    assert.match(spike, /no soft-pass/i);
    assert.match(spike, /vendored pin|vendor existing/i);
    assert.match(spike, /upstream maintain/i);
    assert.match(spike, /not necessarily\s+atebites-authored/i);
    assert.match(spike, /linear-driven-flow\.md/);
    assert.match(spike, /list_issues/);
    assert.match(spike, /get_issue/);
    assert.match(spike, /Closes BLA-n/);
    assert.match(spike, /[Ss]ession start/);
    assert.match(spike, /auto-delegate/);
    assert.match(spike, /mcp\.linear\.app\/mcp/);
    assert.match(spike, /[Nn]o claim that Linear Agent skills are installed|[Dd]o not claim Linear Agent/);
    assert.match(spike, /taskboard/);
    assert.match(spike, /No CE|CE \/ taskboard|taskboard \/ CE/);
    assert.match(spike, /does not change that plugin|does \*\*not\*\* change that plugin/);
    assert.match(spike, /[Nn]o invented Linear API secrets|Do not invent Linear API secrets/);
    assert.doesNotMatch(spike, /@[0-9a-f]{40}/);
  });

  it("ships thin host plugin.json placeholders without secrets or MCP schemas", () => {
    for (const rel of HOST_MANIFESTS) {
      const path = join(pluginRoot, rel);
      assert.equal(existsSync(path), true, `missing ${rel}`);
      const text = readFileSync(path, "utf8");
      const json = JSON.parse(text);
      assert.equal(json.name, "linear-tracking");
      assert.match(json.version, /spike/);
      assert.match(json.description, /[Nn]ot a Factory default|[Nn]ot catalog-listed/);
      for (const pattern of SECRET_PATTERNS) {
        assert.doesNotMatch(text, pattern, `${rel} must not invent Linear secrets`);
      }
    }

    const skill = readFileSync(join(pluginRoot, "skills/linear-tracking/SKILL.md"), "utf8");
    assert.doesNotMatch(skill, /"type":\s*"object"/);
    assert.doesNotMatch(skill, /inputSchema/);
    for (const pattern of SECRET_PATTERNS) {
      assert.doesNotMatch(skill, pattern);
    }
    assert.equal(existsSync(join(pluginRoot, "mcp.json")), false);
  });

  it("README Upcoming section mentions the spike without catalog install commands", () => {
    const readme = read("README.md");
    assert.match(readme, /Upcoming \/ P2 spike/);
    assert.match(readme, /plugins\/linear-tracking/);
    assert.match(readme, /docs\/SPIKE-LINEAR-TRACKING\.md/);
    assert.doesNotMatch(readme, /grok plugin install linear-tracking --trust/);
    assert.doesNotMatch(readme, /\/plugin install linear-tracking@atebites-plugins/);
    assert.doesNotMatch(readme, /codex plugin add linear-tracking@atebites-plugins/);
    assert.doesNotMatch(readme, /\/plugins install linear-tracking/);
    assert.match(readme, /[Dd]o not claim Linear Agent skills installed/);
  });
});
