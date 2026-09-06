import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(root, "plugins/linear-tracking");

const VENDOR_PIN_SHA = "49f948faa9258a0c61caceaf225e179651397431";
const VENDOR_SKILL_SHA256 =
  "ce0f39c95b6c9190f8ea33614393cdb556b2684dd8388ded394e9cb915f42601";

/** #34 evidence SHAs — rejected as Factory pins (except interim skills HEAD). */
const EVIDENCE_SHAS = {
  "linear/cursor-plugin HEAD": "c2c4cb2ab23206c9219b0dd31c9571e4c922faeb",
  "openai/plugins HEAD": "1e285826e604f66f7208f7ac4dba0fe8341d1f57",
  "openai/plugins path": "33bd9529725fcee78c9e51fcbaa93cd963c3a47b",
  "anthropics official HEAD": "85cce0381e7860082641b59d961a2b8c368b8b79",
  "anthropics path": "ab2b6d0cad88ead3da5466ef2acef0c4a351971e",
  "openai/skills path": "77963424cd7687fd52e5fcfdd3f08d826ab9b1ab",
};

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

function sha256File(absPath) {
  return createHash("sha256").update(readFileSync(absPath)).digest("hex");
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

  it("ships the placement skill with SPIKE labels and the three rules", () => {
    assert.equal(existsSync(join(pluginRoot, "README.md")), true);
    const readme = readFileSync(join(pluginRoot, "README.md"), "utf8");
    assert.match(readme, /SPIKE/);
    assert.match(readme, /not a Factory default/i);
    assert.match(readme, /[Nn]ot catalog-listed/);
    assert.match(readme, /upcoming/i);
    assert.match(readme, /[Dd]o not claim Linear Agent skills installed/);
    assert.match(readme, /\*\*P N\*\*|\/ P N \//);
    assert.match(readme, /interim/i);
    assert.match(readme, /deprecated/i);
    assert.match(readme, new RegExp(VENDOR_PIN_SHA));
    assert.match(readme, /vendor\/linear/);

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
    assert.match(skill, /vendor\/linear\/SKILL\.md/);
    assert.match(skill, new RegExp(VENDOR_PIN_SHA));
    assert.doesNotMatch(skill, /Linear Agent skills are installed/);
  });

  it("records the vendor pin SHA and required behaviors", () => {
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
    assert.match(spike, new RegExp(VENDOR_PIN_SHA));
    assert.match(spike, /Vendored pin chosen|vendored pin chosen/i);
    assert.match(spike, /\*\*P N\*\*/);
    assert.match(spike, /interim/i);
    assert.match(spike, /deprecated/i);
    assert.match(spike, /not Superpowers-class|Not Superpowers-class/);
    for (const [label, sha] of Object.entries(EVIDENCE_SHAS)) {
      assert.match(spike, new RegExp(sha), `SPIKE must cite ${label}`);
    }
    assert.match(spike, /linear\/cursor-plugin/);
    assert.match(spike, /anthropics\/claude-plugins-official/);
    assert.match(spike, /do not fork|Do \*\*not\*\* copy those remotes/i);
  });

  it("vendors the openai/skills curated linear tree without rewriting it", () => {
    const upstream = readFileSync(join(pluginRoot, "UPSTREAM.md"), "utf8");
    assert.match(upstream, /https:\/\/github\.com\/openai\/skills/);
    assert.match(upstream, /skills\/\.curated\/linear/);
    assert.match(upstream, new RegExp(VENDOR_PIN_SHA));
    assert.match(upstream, /mcp\.linear\.app\/mcp/);
    assert.match(upstream, /no bundled skills/);
    assert.match(upstream, /\*\*P N\*\*/);
    assert.match(upstream, /interim/i);
    assert.match(upstream, /deprecated/i);
    assert.match(upstream, /not Superpowers-class|Not Superpowers-class|not a Superpowers-class/);
    assert.match(upstream, /standalone OSI-licensed/);
    assert.match(upstream, /Do \*\*not\*\*\s+copy the others into `\.gitmodules`/);
    for (const [label, sha] of Object.entries(EVIDENCE_SHAS)) {
      assert.match(upstream, new RegExp(sha), `UPSTREAM.md must cite ${label}`);
    }
    assert.match(upstream, /linear\/cursor-plugin/);
    assert.match(upstream, /anthropics\/claude-plugins-official/);
    assert.match(upstream, /no LICENSE/);
    assert.match(upstream, /Lane B awaiting Jay credentials/);

    const vendorSkillPath = join(pluginRoot, "vendor/linear/SKILL.md");
    assert.equal(existsSync(vendorSkillPath), true);
    assert.equal(sha256File(vendorSkillPath), VENDOR_SKILL_SHA256);
    const vendorSkill = readFileSync(vendorSkillPath, "utf8");
    assert.match(vendorSkill, /^name: linear$/m);
    assert.match(vendorSkill, /list_issues/);
    assert.match(vendorSkill, /list_my_issues/);
    assert.match(vendorSkill, /get_issue/);
    assert.match(vendorSkill, /mcp\.linear\.app\/mcp/);
    assert.doesNotMatch(vendorSkill, /inputSchema/);
    for (const pattern of SECRET_PATTERNS) {
      assert.doesNotMatch(vendorSkill, pattern);
    }

    assert.equal(existsSync(join(pluginRoot, "vendor/linear/LICENSE.txt")), true);
    assert.equal(existsSync(join(pluginRoot, "NOTICE")), true);
    const notice = readFileSync(join(pluginRoot, "NOTICE"), "utf8");
    assert.match(notice, /Apache-2\.0|Apache License/);
    assert.match(notice, new RegExp(VENDOR_PIN_SHA));

    const gitmodules = existsSync(join(root, ".gitmodules"))
      ? read(".gitmodules")
      : "";
    assert.doesNotMatch(gitmodules, /linear-tracking/);
    assert.doesNotMatch(gitmodules, /linear\/cursor-plugin/);
    assert.doesNotMatch(gitmodules, /openai\/plugins/);
    assert.doesNotMatch(gitmodules, /claude-plugins-official/);
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
    assert.equal(existsSync(join(pluginRoot, ".mcp.json")), false);
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
    assert.match(readme, /\*\*P N\*\*/);
    assert.match(readme, /interim/i);
    assert.match(readme, /deprecated/);
  });
});
