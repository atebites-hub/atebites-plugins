import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(root, "plugins/host-adapters");

const CATALOGS = [
  ".cursor-plugin/marketplace.json",
  ".grok-plugin/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "marketplace.json",
];

const FORBIDDEN_MARKETPLACE_NAMES = ["host-adapters", "factory-harness", "factory-host-adapters"];

function read(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

function catalogNames(relPath) {
  const marketplace = JSON.parse(read(relPath));
  return (marketplace.plugins || []).map((plugin) => plugin.name);
}

describe("host-adapters P2–P3 spike (not a catalog / Factory default / bot)", () => {
  it("is absent from every host marketplace catalog, including killed factory-harness", () => {
    for (const rel of CATALOGS) {
      const names = catalogNames(rel);
      for (const forbidden of FORBIDDEN_MARKETPLACE_NAMES) {
        assert.equal(
          names.includes(forbidden),
          false,
          `${rel} must not list ${forbidden} (spike is non-default; factory-harness is killed)`,
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
  });

  it("ships the inline pack with SPIKE labels, Codex/ZCode recipes, and no bot hooks", () => {
    assert.equal(existsSync(join(pluginRoot, "README.md")), true);
    const readme = readFileSync(join(pluginRoot, "README.md"), "utf8");
    assert.match(readme, /SPIKE/);
    assert.match(readme, /not a Factory default/i);
    assert.match(readme, /[Nn]ot a bot/);
    assert.match(readme, /factory-harness/);
    assert.match(readme, /open-dynamic-workflows@open-dynamic-workflows/);
    assert.match(readme, /atebites-plugins/);
    assert.match(readme, /dangerously-bypass-hook-trust/);
    assert.match(readme, /\.plugins\[\]\.id/);

    assert.equal(existsSync(join(pluginRoot, "recipes/codex.md")), true);
    assert.equal(existsSync(join(pluginRoot, "recipes/zcode.md")), true);
    assert.equal(existsSync(join(pluginRoot, "recipes/CHECKLIST.md")), true);

    const codex = readFileSync(join(pluginRoot, "recipes/codex.md"), "utf8");
    assert.match(codex, /advisor doctor --host codex/);
    assert.match(codex, /open-dynamic-workflows@open-dynamic-workflows/);
    assert.match(codex, /Never.*--dangerously-bypass-hook-trust/s);
    assert.match(codex, /--run-dir/);
    assert.match(codex, /workflow\(\)/);
    assert.match(codex, /seating-002/);
    assert.match(codex, /run-mtoxds2b-c5361e/);
    assert.match(codex, /gpt-5\.3-codex-spark/);
    assert.match(codex, /reasoningEffort.*medium|medium/);
    assert.match(codex, /[Ee]xample shape/);
    assert.match(codex, /not a catalog \/ Lane B/);
    assert.match(codex, /[Ll]aunch first|[Ll]aunch.*then/s);

    const zcode = readFileSync(join(pluginRoot, "recipes/zcode.md"), "utf8");
    assert.match(zcode, /advisor doctor --host zcode/);
    assert.match(zcode, /\.plugins\[\]\.id/);
    assert.match(zcode, /open-dynamic-workflows@open-dynamic-workflows/);
    assert.match(zcode, /--run-dir/);
    assert.match(zcode, /workflow\(\)/);

    const checklist = readFileSync(join(pluginRoot, "recipes/CHECKLIST.md"), "utf8");
    assert.match(checklist, /Superpowers/);
    assert.match(checklist, /ponytail/);
    assert.match(checklist, /Advisor/);
    assert.match(checklist, /ODW/);
    assert.match(checklist, /factory-policy/);
    assert.match(checklist, /Do \*\*not\*\* seat CE/);
    assert.doesNotMatch(checklist, /compound-engineering/);
    assert.doesNotMatch(checklist, /install CE as a Factory default/i);

    assert.equal(existsSync(join(pluginRoot, "hooks")), false, "host-adapters must not ship bot hooks");
  });

  it("names problem/proposal/ownership/success and kills factory-harness", () => {
    const spike = read("docs/SPIKE-HOST-ADAPTERS.md");
    assert.match(spike, /SPIKE/);
    assert.match(spike, /## Problem/);
    assert.match(spike, /## Proposal/);
    assert.match(spike, /## Ownership/);
    assert.match(spike, /## Success for this spike/);
    assert.match(spike, /no soft-pass/);
    assert.match(spike, /factory-harness/);
    assert.match(spike, /Factory Harness bot/);
    assert.match(spike, /Factory Plugins/);
    assert.match(spike, /Factory QA/);
    assert.match(spike, /Assistant/);
    assert.match(spike, /open-dynamic-workflows@open-dynamic-workflows/);
    assert.match(spike, /\.plugins\[\]\.id/);
    assert.match(spike, /dangerously-bypass-hook-trust/);
    assert.match(spike, /--run-dir/);
    assert.match(spike, /workflow\(\)/);
    assert.match(spike, /seating-002/);
    assert.match(spike, /run-mtoxds2b-c5361e/);
    assert.match(spike, /gpt-5\.3-codex-spark/);
    assert.match(spike, /SPIKE-FACTORY-POLICY\.md/);
    assert.match(spike, /No CE/);
    assert.doesNotMatch(spike, /enabledPlugins.*host-adapters/);
  });

  it("print/help scripts exit 0 and never claim a pass", () => {
    const scripts = [
      ["print-help.sh", []],
      ["print-checklist.sh", []],
      ["print-recipe.sh", ["--host", "codex"]],
      ["print-recipe.sh", ["--host", "zcode"]],
    ];
    for (const [name, args] of scripts) {
      const path = join(pluginRoot, "scripts", name);
      assert.equal(existsSync(path), true, `missing ${name}`);
      const result = spawnSync("bash", [path, ...args], { encoding: "utf8" });
      assert.equal(result.status, 0, `${name} ${args.join(" ")} must exit 0: ${result.stderr}`);
      assert.match(result.stdout, /SPIKE stub/, `${name} must print SPIKE stub`);
      assert.match(result.stdout, /not a seating pass|not a pass|not enforcing/i);
      assert.doesNotMatch(result.stdout, /^PASS:|VERIFY .*PASSED|seating PASSED/m);
      assert.doesNotMatch(result.stdout, /Lane B (PASS|passed)/i);
    }

    const missingHost = spawnSync("bash", [join(pluginRoot, "scripts/print-recipe.sh")], {
      encoding: "utf8",
    });
    assert.notEqual(missingHost.status, 0, "print-recipe without --host must not succeed");
    assert.doesNotMatch(`${missingHost.stdout}${missingHost.stderr}`, /\bPASS\b/);
  });

  it("README Upcoming section mentions the spike without catalog install commands", () => {
    const readme = read("README.md");
    assert.match(readme, /Upcoming \/ P2–P3 spike/);
    assert.match(readme, /plugins\/host-adapters/);
    assert.match(readme, /docs\/SPIKE-HOST-ADAPTERS\.md/);
    assert.doesNotMatch(readme, /grok plugin install host-adapters --trust/);
    assert.doesNotMatch(readme, /\/plugin install host-adapters@atebites-plugins/);
    assert.doesNotMatch(readme, /codex plugin add host-adapters@atebites-plugins/);
    assert.doesNotMatch(readme, /\/plugins install host-adapters/);
    assert.doesNotMatch(readme, /grok plugin install factory-harness --trust/);
    assert.doesNotMatch(readme, /codex plugin add factory-harness@atebites-plugins/);
  });
});
