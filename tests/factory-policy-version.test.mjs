import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('factory-policy patch release is consistent across native manifests and catalog', () => {
  const expected = JSON.parse(fs.readFileSync('plugins/factory-policy/plugin.json')).version;
  for (const host of ['claude', 'codex', 'cursor', 'grok', 'zcode']) {
    const path = `plugins/factory-policy/.${host}-plugin/plugin.json`;
    assert.equal(JSON.parse(fs.readFileSync(path)).version, expected, path);
  }
  const catalog = JSON.parse(fs.readFileSync('marketplace.json'));
  assert.equal(catalog.plugins.find(p => p.name === 'factory-policy').version, expected);
  const codex = JSON.parse(fs.readFileSync('.agents/plugins/marketplace.json'));
  assert.equal(codex.plugins.find(p => p.name === 'factory-policy').version, expected);
});
