#!/usr/bin/env node
/**
 * Validate host marketplace catalogs.
 *
 * Cursor `.cursor-plugin/marketplace.json` is checked against the official
 * schema. All catalogs must list the six in-repo plugins with local paths.
 */
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_URL =
  "https://raw.githubusercontent.com/cursor/plugins/main/schemas/marketplace.schema.json";
const EXPECTED = [
  "open-dynamic-workflows",
  "ponytail",
  "sol-advisor",
  "taskboard",
  "j-space",
  "llm-as-a-verifier",
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(relPath) {
  const full = join(root, relPath);
  if (!existsSync(full)) fail(`missing ${relPath}`);
  try {
    return JSON.parse(readFileSync(full, "utf8"));
  } catch (error) {
    fail(`invalid JSON ${relPath}: ${error.message}`);
  }
}

function assertLocal(name, source, label) {
  const text = JSON.stringify(source);
  if (/https?:\/\//i.test(text)) {
    fail(`${label} ${name}: remote URL sources are not allowed: ${text}`);
  }
  if (/DietrichGebert|imsai-sh|xz1220/i.test(text)) {
    fail(`${label} ${name}: source must use atebites-hub (or in-repo wrap), got ${text}`);
  }
}

function namesOf(marketplace) {
  return (marketplace.plugins || []).map((plugin) => plugin.name).sort();
}

function assertCatalog(marketplace, label) {
  const names = namesOf(marketplace);
  const expected = [...EXPECTED].sort();
  if (JSON.stringify(names) !== JSON.stringify(expected)) {
    fail(`${label} plugins ${JSON.stringify(names)} !== ${JSON.stringify(expected)}`);
  }
}

const cursorMarketplace = readJson(".cursor-plugin/marketplace.json");
const schemaResponse = await fetch(SCHEMA_URL);
if (!schemaResponse.ok) {
  fail(`failed to fetch Cursor marketplace schema: HTTP ${schemaResponse.status}`);
}
const schema = await schemaResponse.json();
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(cursorMarketplace)) {
  fail(
    `Cursor marketplace.json schema validation failed:\n${ajv.errorsText(validate.errors, { separator: "\n" })}`,
  );
}

if (cursorMarketplace.name !== "atebites-plugins") {
  fail(`Cursor marketplace name must be atebites-plugins`);
}
if (cursorMarketplace.owner?.name !== "atebites-hub") {
  fail(`Cursor marketplace owner.name must be atebites-hub`);
}
assertCatalog(cursorMarketplace, "Cursor");

for (const entry of cursorMarketplace.plugins) {
  const keys = Object.keys(entry).sort();
  if (JSON.stringify(keys) !== JSON.stringify(["description", "name", "source"])) {
    fail(`Cursor entry ${entry.name} keys ${JSON.stringify(keys)} (only name/source/description)`);
  }
  if (typeof entry.source !== "string") {
    fail(`Cursor entry ${entry.name} source must be a relative path string`);
  }
  assertLocal(entry.name, entry.source, "Cursor");
  const pluginJson = join(root, entry.source, ".cursor-plugin/plugin.json");
  if (!existsSync(pluginJson)) {
    fail(`Cursor source ${entry.source} has no .cursor-plugin/plugin.json`);
  }
  const manifest = JSON.parse(readFileSync(pluginJson, "utf8"));
  if (manifest.name !== entry.name) {
    fail(`Cursor ${entry.name} plugin.json name is ${manifest.name}`);
  }
}

const grok = readJson(".grok-plugin/marketplace.json");
assertCatalog(grok, "Grok");
for (const entry of grok.plugins) {
  if (entry.source?.type !== "local") {
    fail(`Grok ${entry.name} source.type must be local`);
  }
  assertLocal(entry.name, entry.source, "Grok");
}

const claude = readJson(".claude-plugin/marketplace.json");
if (!claude.$schema) fail("Claude marketplace missing $schema");
assertCatalog(claude, "Claude");
for (const entry of claude.plugins) {
  if (typeof entry.source !== "string" || !entry.source.startsWith("./")) {
    fail(`Claude ${entry.name} source must be a ./ path`);
  }
  assertLocal(entry.name, entry.source, "Claude");
}

const codex = readJson(".agents/plugins/marketplace.json");
assertCatalog(codex, "Codex");
for (const entry of codex.plugins) {
  if (entry.source?.source !== "local") {
    fail(`Codex ${entry.name} source.source must be local`);
  }
  assertLocal(entry.name, entry.source, "Codex");
}

const zcode = readJson("marketplace.json");
assertCatalog(zcode, "ZCode");
for (const entry of zcode.plugins) {
  if (typeof entry.source !== "string") {
    fail(`ZCode ${entry.name} source must be a local path string`);
  }
  assertLocal(entry.name, entry.source, "ZCode");
}

console.log("ok: Cursor schema + six local-path catalogs");
