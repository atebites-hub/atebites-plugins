import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
const root = new URL('../', import.meta.url);
for (const catalog of ['.agents/plugins/marketplace.json','.claude-plugin/marketplace.json','.cursor-plugin/marketplace.json','.grok-plugin/marketplace.json','marketplace.json']) {
 const data=JSON.parse(readFileSync(new URL(catalog,root)));
 assert.equal(data.plugins.some(p=>p.name==='open-dynamic-workflows'),false);
 assert.ok(data.plugins.some(p=>p.name==='native-orchestration'));
}
for (const host of ['claude','codex','cursor','grok','zcode']) {
 const dir=new URL('plugins/native-orchestration/',root);
 const manifest=JSON.parse(readFileSync(new URL(`.${host}-plugin/plugin.json`,dir)));
 assert.equal(manifest.skills,'./skills/');
 assert.equal(manifest.mcpServers,undefined);
 assert.equal(manifest.hooks,undefined);
 for(const name of ['.mcp.json','mcp.json','scripts','node_modules']) assert.equal(existsSync(new URL(name,dir)),false);
}
console.log('PASS: native routing is skill-only; retired ODW is absent from catalogs');
