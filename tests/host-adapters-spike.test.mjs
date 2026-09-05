import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packRoot = join(root, "plugins/host-adapters");

const CATALOGS = [
  ".cursor-plugin/marketplace.json",
  ".grok-plugin/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "marketplace.json",
];

const FORBIDDEN_NAMES = ["factory-harness", "factory-host-adapters"];

function read(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

function catalogNames(relPath) {
  const marketplace = JSON.parse(read(relPath));
  return (marketplace.plugins || []).map((plugin) => plugin.name);
}

describe("host-adapters P2–P3 spike (not a catalog / Factory default / bot)", () => {
  it("is absent from every host marketplace catalog", () => {
    for (const rel of CATALOGS) {
      const names = catalogNames(rel);
      assert.equal(
        names.includes("host-adapters"),
        false,
        `${rel} must not list host-adapters (spike is non-default)`,
      );
      for (const forbidden of FORBIDDEN_NAMES) {
        assert.equal(
          names.includes(forbidden),
          false,
          `${rel} must not list killed/rejected name ${forbidden}`,
        );
      }
    }
  });

  it("does not appear in the Factory story kept list", () => {
    const index = read("docs/FORK-INDEX.md");
    const keptBlock = index.split("Discarded from Factory")[0];
    assert.match(keptBlock, /Kept in the Factory story/);
    assert.doesNotMatch(keptBlock, /host-adapters/);
    assert.doesNotMatch(keptBlock, /factory-harness/);
    assert.match(index, /Upcoming \/ P2–P3 spike/);
    assert.match(index, /plugins\/host-adapters/);
    assert.match(index, /not a bot/);
  });

  it("does not scaffold factory-harness and names the rejected aliases", () => {
    assert.equal(existsSync(join(root, "plugins/factory-harness")), false);
    assert.equal(existsSync(join(root, "plugins/factory-host-adapters")), false);

    const spike = read("docs/SPIKE-HOST-ADAPTERS.md");
    assert.match(spike, /host-adapters/);
    assert.match(spike, /factory-harness/);
    assert.match(spike, /factory-host-adapters/);
    assert.match(spike, /Killed|killed/);
    assert.match(spike, /Rejected alias|rejected alias/);
    assert.match(spike, /Factory Harness bot/);
    assert.match(spike, /never/i);
  });

  it("ships Codex/ZCode recipes, shared checklist, and SPIKE labels", () => {
    assert.equal(existsSync(join(packRoot, "README.md")), true);
    const readme = readFileSync(join(packRoot, "README.md"), "utf8");
    assert.match(readme, /SPIKE/);
    assert.match(readme, /not a Factory default/i);
    assert.match(readme, /Not a bot|not a bot/);

    const codex = readFileSync(join(packRoot, "hosts/codex.md"), "utf8");
    const zcode = readFileSync(join(packRoot, "hosts/zcode.md"), "utf8");
    const checklist = readFileSync(join(packRoot, "hosts/CHECKLIST.md"), "utf8");

    for (const text of [codex, zcode]) {
      assert.match(text, /Pin SHA|pin SHA/);
      assert.match(text, /advisor doctor --host/);
      assert.match(text, /open-dynamic-workflows@open-dynamic-workflows/);
      assert.match(text, /0\.3\.0/);
      assert.match(text, /atebites-plugins/);
      assert.match(text, /does not satisfy doctor alone/);
      assert.match(text, /--run-dir/);
      assert.match(text, /workflow MCP|workflow\(\)/);
      assert.match(text, /bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3/);
      assert.doesNotMatch(text, /39bc5f1d/);
      assert.doesNotMatch(text, /catalog pin lacks #12|catalog stays 39bc5f1/i);
    }

    assert.match(codex, /\/hooks/);
    assert.match(codex, /user-gated|no bypass/);
    assert.match(zcode, /\.plugins\[\]\.id/);
    assert.match(zcode, /bdcf8d5d/);

    assert.match(checklist, /Cursor/);
    assert.match(checklist, /Claude/);
    assert.match(checklist, /Antigravity/);
    assert.match(checklist, /Parked|parked|placeholder/i);
  });

  it("seats Factory ponytail at intensity full and does not recommend lite", () => {
    const readme = read("README.md");
    const index = read("docs/FORK-INDEX.md");
    const spike = read("docs/SPIKE-HOST-ADAPTERS.md");
    const packReadme = readFileSync(join(packRoot, "README.md"), "utf8");
    const codex = readFileSync(join(packRoot, "hosts/codex.md"), "utf8");
    const zcode = readFileSync(join(packRoot, "hosts/zcode.md"), "utf8");
    const checklist = readFileSync(join(packRoot, "hosts/CHECKLIST.md"), "utf8");

    for (const [label, text] of [
      ["README.md", readme],
      ["docs/FORK-INDEX.md", index],
      ["docs/SPIKE-HOST-ADAPTERS.md", spike],
      ["host-adapters README", packReadme],
      ["codex.md", codex],
      ["zcode.md", zcode],
      ["CHECKLIST.md", checklist],
    ]) {
      assert.match(text, /intensity \*\*full\*\*/, `${label} must lock ponytail intensity full`);
      assert.doesNotMatch(text, /PONYTAIL_DEFAULT_MODE=lite/, `${label} must not set lite`);
      assert.doesNotMatch(
        text,
        /defaultMode["']?\s*[:=]\s*["']lite["']/,
        `${label} must not config lite`,
      );
      assert.doesNotMatch(text, /\/ponytail lite/, `${label} must not recommend /ponytail lite`);
    }

    assert.match(codex, /PONYTAIL_DEFAULT_MODE=full/);
    assert.match(zcode, /PONYTAIL_DEFAULT_MODE=full/);
    assert.match(codex, /"defaultMode": "full"/);
    assert.match(zcode, /"defaultMode": "full"/);
  });

  it("names ownership and seating facts in the spike doc", () => {
    const spike = read("docs/SPIKE-HOST-ADAPTERS.md");
    assert.match(spike, /SPIKE/);
    assert.match(spike, /no soft-pass/);
    assert.match(spike, /Factory Harness bot/);
    assert.match(spike, /box installs/);
    assert.match(spike, /open-dynamic-workflows@open-dynamic-workflows/);
    assert.match(spike, /\.plugins\[\]/);
    assert.match(spike, /atebites-plugins/);
    assert.match(spike, /does not satisfy doctor alone/);
    assert.match(spike, /\/hooks/);
    assert.match(spike, /no bypass|user-gated/);
    assert.match(spike, /--run-dir/);
    assert.match(spike, /No CE/);
    assert.match(spike, /taskboard \/ j-space|taskboard/);
    assert.match(spike, /does not bump/i);
    assert.match(spike, /bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3/);
    assert.doesNotMatch(spike, /39bc5f1d/);
    assert.doesNotMatch(spike, /catalog stays 39bc5f1|tip after #12 is `8fc0bcf0/i);
  });

  it("stub script prints recipe steps, exits 0, and does not auto-trust or claim a pass", () => {
    const path = join(packRoot, "scripts/print-recipe.sh");
    assert.equal(existsSync(path), true, "missing print-recipe.sh");

    for (const host of ["codex", "zcode", "checklist"]) {
      const result = spawnSync("bash", [path, "--host", host], { encoding: "utf8" });
      assert.equal(result.status, 0, `${host} must exit 0: ${result.stderr}`);
      assert.match(result.stdout, /SPIKE stub/, `${host} must print SPIKE stub`);
      assert.match(result.stdout, /not enforcing|not a seating pass/i);
      assert.doesNotMatch(result.stdout, /\bPASSED\b|\bVERIFY PASSED\b/);
      assert.match(result.stdout, /not a seating pass|not seating/);
      assert.match(result.stdout, /intensity full/, `${host} must seat ponytail at full`);
      assert.doesNotMatch(result.stdout, /PONYTAIL_DEFAULT_MODE=lite/);
      assert.doesNotMatch(result.stdout, /plugin (?:install|add) \S+ --trust/);
    }

    const script = readFileSync(path, "utf8");
    assert.doesNotMatch(script, /plugin (?:install|add) \S+ --trust/);
    assert.match(script, /user-gated|no bypass|never passes a trust flag|no --trust/);

    const bad = spawnSync("bash", [path, "--host", "unknown"], { encoding: "utf8" });
    assert.notEqual(bad.status, 0, "unknown host must not exit 0");
  });

  it("README Upcoming section mentions the spike without catalog install commands", () => {
    const readme = read("README.md");
    assert.match(readme, /Upcoming \/ P2–P3 spike/);
    assert.match(readme, /plugins\/host-adapters/);
    assert.match(readme, /docs\/SPIKE-HOST-ADAPTERS\.md/);
    assert.match(readme, /not a bot/i);
    assert.doesNotMatch(readme, /grok plugin install host-adapters --trust/);
    assert.doesNotMatch(readme, /\/plugin install host-adapters@atebites-plugins/);
    assert.doesNotMatch(readme, /codex plugin add host-adapters@atebites-plugins/);
    assert.doesNotMatch(readme, /\/plugins install host-adapters/);
    assert.doesNotMatch(readme, /factory-harness@atebites-plugins/);
  });
});
