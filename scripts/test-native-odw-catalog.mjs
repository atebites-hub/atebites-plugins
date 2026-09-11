import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const root = new URL('../', import.meta.url);
const pin = execFileSync('git',['-C',new URL('plugins/open-dynamic-workflows',root).pathname,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
for (const [host,catalog] of [['claude','.claude-plugin/marketplace.json'],['codex','.agents/plugins/marketplace.json']]) {
 const data=JSON.parse(readFileSync(new URL(catalog,root)));
 const entry=data.plugins.find(p=>p.name==='open-dynamic-workflows');
 assert.equal(entry.version,'0.4.0');
 assert.deepEqual(entry.source,{source:'git-subdir',url:'https://github.com/atebites-hub/open-dynamic-workflows-plugin.git',path:`./native/${host}/open-dynamic-workflows`,sha:pin});
 const dir=new URL(`plugins/open-dynamic-workflows/native/${host}/open-dynamic-workflows/`,root);
 const manifest=JSON.parse(readFileSync(new URL(`.${host}-plugin/plugin.json`,dir)));
 assert.equal(manifest.version,'0.4.0');
 assert.ok(existsSync(new URL('skills/native-orchestration/SKILL.md',dir)));
 for(const name of ['.mcp.json','mcp.json']) assert.equal(existsSync(new URL(name,dir)),false);
 assert.equal(manifest.mcpServers,undefined);
}
console.log('PASS: Claude/Codex catalog sources pin the native-only ODW packages');
