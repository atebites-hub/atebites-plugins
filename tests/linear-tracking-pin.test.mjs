import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const CATALOGS = [
  ".cursor-plugin/marketplace.json",
  ".grok-plugin/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "marketplace.json",
];

const EVIDENCE_SHAS = {
  "linear/cursor-plugin HEAD": "c2c4cb2ab23206c9219b0dd31c9571e4c922faeb",
  "openai/plugins HEAD": "1e285826e604f66f7208f7ac4dba0fe8341d1f57",
  "openai/plugins path": "33bd9529725fcee78c9e51fcbaa93cd963c3a47b",
  "anthropics official HEAD": "85cce0381e7860082641b59d961a2b8c368b8b79",
  "anthropics path": "ab2b6d0cad88ead3da5466ef2acef0c4a351971e",
  "openai/skills HEAD": "49f948faa9258a0c61caceaf225e179651397431",
  "openai/skills path": "77963424cd7687fd52e5fcfdd3f08d826ab9b1ab",
};

const SECRET_PATTERNS = [
  /lin_api_[a-zA-Z0-9]+/,
  /Authorization:\s*Bearer\s+\S+/i,
];

function read(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

function catalogNames(relPath) {
  const marketplace = JSON.parse(read(relPath));
  return (marketplace.plugins || []).map((plugin) => plugin.name);
}

describe("linear-tracking pin readiness (P N / blocked, not installed)", () => {
  it("records honest P N blockers without selecting a vendor pin", () => {
    const pin = read("docs/PIN-LINEAR-TRACKING.md");
    assert.match(pin, /\*\*P N\*\*/);
    assert.match(pin, /Pin blocked|pin blocked/i);
    assert.match(pin, /[Nn]ot installed/);
    assert.match(pin, /[Nn]ot catalog-listed/);
    assert.match(pin, /[Nn]ot a Factory default/);
    assert.match(pin, /Do not open a pin PR/);
    assert.match(pin, /none selected|not selected/i);
    assert.match(pin, /Factory Plugins bot/);
    assert.match(pin, /do not fork yet|should not open/i);
    assert.match(pin, /Lane B awaiting Jay credentials/);
    assert.match(pin, /linear\/cursor-plugin/);
    assert.match(pin, /openai\/plugins/);
    assert.match(pin, /anthropics\/claude-plugins-official/);
    assert.match(pin, /openai\/skills/);
    assert.match(pin, /linear-driven-flow\.md/);
    assert.match(pin, /[Nn]o bundled skills|[Nn]o skills/);
    assert.match(pin, /Closes BLA-n/);
    assert.match(pin, /mcp\.linear\.app\/mcp/);
    assert.match(pin, /Linear Agent skill install/);
    assert.match(pin, /soft-pass Linear as installed/);
    assert.doesNotMatch(pin, /Linear Agent skills are installed/);
    for (const pattern of SECRET_PATTERNS) {
      assert.doesNotMatch(pin, pattern);
    }
  });

  it("cites verified evidence SHAs and forbids copying them into gitlinks", () => {
    const pin = read("docs/PIN-LINEAR-TRACKING.md");
    for (const [label, sha] of Object.entries(EVIDENCE_SHAS)) {
      assert.match(pin, new RegExp(sha), `pin note must cite ${label}`);
    }
    assert.match(pin, /not.*marketplace pins|Do \*\*not\*\*\s+copy them into `\.gitmodules`/i);
    assert.match(pin, /Do \*\*not\*\*\s+copy them into `\.gitmodules`/);
    assert.match(pin, /do not gitlink monorepos/i);
  });

  it("does not add a linear-tracking gitlink or catalog row", () => {
    const gitmodules = read(".gitmodules");
    assert.doesNotMatch(gitmodules, /linear-tracking/);
    assert.doesNotMatch(gitmodules, /linear\/cursor-plugin/);
    assert.doesNotMatch(gitmodules, /openai\/plugins/);
    assert.doesNotMatch(gitmodules, /claude-plugins-official/);
    assert.equal(existsSync(join(root, "plugins/linear-tracking/.git")), false);

    for (const rel of CATALOGS) {
      assert.equal(
        catalogNames(rel).includes("linear-tracking"),
        false,
        `${rel} must not list linear-tracking`,
      );
    }
  });

  it("keeps README / FORK-INDEX / stub labeled P N and points at the pin note", () => {
    const readme = read("README.md");
    const index = read("docs/FORK-INDEX.md");
    const spike = read("docs/SPIKE-LINEAR-TRACKING.md");
    const pluginReadme = read("plugins/linear-tracking/README.md");
    const maintenance = read("docs/FORK-MAINTENANCE.md");

    for (const [label, text] of [
      ["README.md", readme],
      ["docs/FORK-INDEX.md", index],
      ["docs/SPIKE-LINEAR-TRACKING.md", spike],
      ["plugins/linear-tracking/README.md", pluginReadme],
      ["docs/FORK-MAINTENANCE.md", maintenance],
    ]) {
      assert.match(text, /PIN-LINEAR-TRACKING\.md/, `${label} must point at pin note`);
      assert.match(text, /\*\*P N\*\*/, `${label} must keep honest P N`);
    }

    const keptBlock = index.split("Discarded from Factory")[0];
    assert.doesNotMatch(keptBlock, /linear-tracking/);
    assert.match(index, /Upcoming \/ P2 spike/);
    assert.match(index, /Factory Plugins bot should not open/);
    assert.doesNotMatch(spike, /@[0-9a-f]{40}/);
    assert.doesNotMatch(readme, /grok plugin install linear-tracking --trust/);
    assert.doesNotMatch(readme, /\/plugin install linear-tracking@atebites-plugins/);
  });
});
