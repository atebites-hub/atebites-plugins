import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {test} from 'node:test';

const root=resolve(import.meta.dirname,'..');
const plugin=join(root,'plugins/impeccable');
const skill=join(plugin,'skills/impeccable');

test('Impeccable is a pinned, portable skill-only package',()=>{
  const pin=JSON.parse(readFileSync(join(plugin,'UPSTREAM.json'),'utf8'));
  assert.equal(pin.commit,'2c33196c51ac52e47691384e61d89f1218d8d21d');
  assert.equal(pin.ref,'skill-v4.1.0');
  const actual={};
  function walk(dir){for(const entry of readdirSync(join(plugin,dir),{withFileTypes:true})){
    const file=join(dir,entry.name);
    if(entry.isDirectory()) walk(file);
    else {assert.ok(entry.isFile(),file);actual[file]=createHash('sha256').update(readFileSync(join(plugin,file))).digest('hex');}
  }}
  walk('skills/impeccable');
  assert.ok(Object.keys(actual).length>20);
  assert.deepEqual(actual,pin.files);
  for(const host of ['codex','claude','cursor','grok','zcode']){
    const manifest=JSON.parse(readFileSync(join(plugin,`.${host}-plugin/plugin.json`),'utf8'));
    assert.equal(manifest.name,'impeccable');assert.equal(manifest.version,'4.1.0');
    assert.equal(manifest.skills,'./skills/');assert.equal(manifest.hooks,undefined);
    assert.equal(manifest.mcpServers,undefined);
  }
  for(const path of ['hooks','.mcp.json','mcp.json','agents']) assert.equal(existsSync(join(plugin,path)),false,path);
  assert.ok(existsSync(join(plugin,'LICENSE')));
  const text=readFileSync(join(skill,'SKILL.md'),'utf8');
  assert.match(text,/version: 4\.1\.0/);
  for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
    if(/^[a-z]+:/i.test(match[1])) continue;
    assert.ok(existsSync(join(skill,match[1].split('#')[0])),match[1]);
  }
});

test('the packaged context loader runs against an isolated project',()=>{
  const fixture=mkdtempSync(join(tmpdir(),'impeccable-context-'));
  try{
    writeFileSync(join(fixture,'PRODUCT.md'),'# Product\nAn isolated frontend fixture.\n');
    writeFileSync(join(fixture,'DESIGN.md'),'# Design\nNeutral background and dark text.\n');
    writeFileSync(join(fixture,'index.html'),'<!doctype html><title>Fixture</title><main>Fixture</main>');
    const result=spawnSync(process.execPath,[join(skill,'scripts/context.mjs'),'--target',join(fixture,'index.html')],{
      cwd:fixture,encoding:'utf8',timeout:30000,env:{...process.env,HOME:fixture,IMPECCABLE_CONTEXT_DIR:fixture},
    });
    assert.equal(result.error,undefined);assert.equal(result.status,0,result.stdout+result.stderr);
    assert.match(result.stdout,/isolated frontend fixture/);
  }finally{rmSync(fixture,{recursive:true,force:true});}
});
