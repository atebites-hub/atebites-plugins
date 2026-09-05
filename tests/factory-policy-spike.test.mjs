import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(root, "plugins/factory-policy");

const CATALOGS = [
  ".cursor-plugin/marketplace.json",
  ".grok-plugin/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "marketplace.json",
];

const CHECK_IDS = ["C3.1", "C3.2", "C3.3", "C5", "C6", "C7"];
const CHECK_NAMES = [
  "doc-cited",
  "scope-literal",
  "plan-filled",
  "gate-runnable",
  "issue-linked",
  "plan-approved",
];

function read(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

function catalogNames(relPath) {
  const marketplace = JSON.parse(read(relPath));
  return (marketplace.plugins || []).map((plugin) => plugin.name);
}

describe("factory-policy P2 spike (not a catalog / Factory default)", () => {
  it("is absent from every host marketplace catalog", () => {
    for (const rel of CATALOGS) {
      const names = catalogNames(rel);
      assert.equal(
        names.includes("factory-policy"),
        false,
        `${rel} must not list factory-policy (spike is non-default)`,
      );
    }
  });

  it("does not appear in the Factory story kept list", () => {
    const index = read("docs/FORK-INDEX.md");
    const keptBlock = index.split("Discarded from Factory")[0];
    assert.match(keptBlock, /Kept in the Factory story/);
    assert.doesNotMatch(keptBlock, /factory-policy/);
    assert.match(index, /Upcoming \/ P2 spike/);
    assert.match(index, /inline SPIKE stub/);
  });

  it("ships the inline plugin stub with SPIKE labels and nested memory-system", () => {
    assert.equal(existsSync(join(pluginRoot, "README.md")), true);
    const readme = readFileSync(join(pluginRoot, "README.md"), "utf8");
    assert.match(readme, /SPIKE/);
    assert.match(readme, /not a Factory default/i);
    assert.match(readme, /memory-system/);

    assert.equal(existsSync(join(pluginRoot, "skills/policy-gate/SKILL.md")), true);
    assert.equal(existsSync(join(pluginRoot, "skills/memory-system/SKILL.md")), true);
    assert.equal(
      existsSync(join(pluginRoot, "skills/memory-system/assets/memory_template.md")),
      true,
    );

    const policyGate = readFileSync(join(pluginRoot, "skills/policy-gate/SKILL.md"), "utf8");
    for (const id of CHECK_IDS) {
      assert.match(policyGate, new RegExp(id), `policy-gate must name ${id}`);
    }
    for (const name of CHECK_NAMES) {
      assert.match(policyGate, new RegExp(name), `policy-gate must name ${name}`);
    }
    assert.match(policyGate, /sequentialthinking/);
    assert.match(policyGate, /does not call `sequentialthinking`|Do not\n?invoke `sequentialthinking`/s);

    const memorySkill = readFileSync(join(pluginRoot, "skills/memory-system/SKILL.md"), "utf8");
    assert.match(memorySkill, /^name: memory-system$/m);
    assert.match(memorySkill, /docs\/memories\//);
  });

  it("names C3–C7 in the spike doc and states stubs are not enforcing", () => {
    const spike = read("docs/SPIKE-FACTORY-POLICY.md");
    assert.match(spike, /SPIKE/);
    assert.match(spike, /no soft-pass/);
    assert.match(spike, /memory-system/);
    for (const id of CHECK_IDS) {
      assert.match(spike, new RegExp(id), `spike doc must name ${id}`);
    }
    for (const name of CHECK_NAMES) {
      assert.match(spike, new RegExp(name), `spike doc must name ${name}`);
    }
    assert.match(spike, /PreToolUse|preToolUse/);
    assert.match(spike, /hop cap/);
    assert.match(spike, /guard-bash/);
    assert.match(spike, /No CE/);
    assert.match(spike, /taskboard \/ j-space/);
  });

  it("stub scripts exit 0 and print SPIKE stub without claiming a pass", () => {
    const scripts = ["policy-gate.sh", "stop-verify.sh", "guard-bash.sh"];
    for (const name of scripts) {
      const path = join(pluginRoot, "scripts", name);
      assert.equal(existsSync(path), true, `missing ${name}`);
      const result = spawnSync("bash", [path], { encoding: "utf8" });
      assert.equal(result.status, 0, `${name} must exit 0: ${result.stderr}`);
      assert.match(result.stdout, /SPIKE stub/, `${name} must print SPIKE stub`);
      assert.match(result.stdout, /not enforcing/i, `${name} must not claim enforcement`);
      assert.doesNotMatch(result.stdout, /\bPASS\b|\bpassed\b/i);
    }
  });

  it("README Upcoming section mentions the spike without catalog install commands", () => {
    const readme = read("README.md");
    assert.match(readme, /Upcoming \/ P2 spike/);
    assert.match(readme, /plugins\/factory-policy/);
    assert.match(readme, /docs\/SPIKE-FACTORY-POLICY\.md/);
    assert.doesNotMatch(readme, /grok plugin install factory-policy --trust/);
    assert.doesNotMatch(readme, /\/plugin install factory-policy@atebites-plugins/);
    assert.doesNotMatch(readme, /codex plugin add factory-policy@atebites-plugins/);
    assert.doesNotMatch(readme, /\/plugins install factory-policy/);
  });
});
