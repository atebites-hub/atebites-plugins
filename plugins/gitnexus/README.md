# gitnexus

**SPIKE — upcoming / P N / not a Factory default. Catalog-listed for pin install.**

Thin marketplace wrap in
[atebites-plugins](https://github.com/atebites-hub/atebites-plugins).
Not a submodule. Not a full atebites-hub fork of the GitNexus monorepo.
Catalog-listed for pin install as `gitnexus@atebites-plugins`.
Not a Factory default. Not wired into project-factory `enabledPlugins`.
Do not treat catalog listing as seated or as Lane B.

Normative scope: [`docs/SPIKE-GITNEXUS.md`](../../docs/SPIKE-GITNEXUS.md).
Pin record: [`UPSTREAM.md`](UPSTREAM.md).

Jay lock (D-GITNEXUS / MASTER-PLAN §4.3): start the F→P wrap so the
marketplace owns a **pinned** `gitnexus@<version>` instead of leaving
Factory on template-only floating `npx`.

## Pin

| Field | Value |
| --- | --- |
| Upstream | [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) |
| npm | `gitnexus@1.6.7` |
| Command | `npx -y gitnexus@1.6.7 mcp` |
| Latest stable observed (2026-09-06) | `1.6.11` (not selected) |

Pin stays **1.6.7** to match the project-factory template `.mcp.json`.
Latest npm `latest` is **1.6.11**. That is not a reason to float, and
not a Factory bump without smoke.

Official upstream MCP configs use `gitnexus@latest`. This wrap does not.

## What this is

Host manifests plus `mcp.json` / `.mcp.json` that spawn the pinned npm
MCP server. Same command shape as the template. No vendored source. No
invented tool schemas. No invented secrets.

If the MCP server is not running / not connected, fail closed. That is
not a pass.

## Not in this plugin

- Catalog install as a factory-default
- project-factory `enabledPlugins` or template `.mcp.json` edits (Assistant)
- A full GitHub fork / weekday sync of the GitNexus monorepo
- Copy of `gitnexus-claude-plugin` or `gitnexus-cursor-integration`
  (those float `@latest` inside the PolyForm-NC monorepo)
- Superpowers / ponytail / Advisor / ODW / factory-policy pin bumps
- CE, taskboard, j-space
- Dogfood Cursor HARD PASS / Lane B attestation

## Opt-in (upcoming only)

Catalog pin: `gitnexus@atebites-plugins` (Upcoming / P N; not a Factory
default). Installability only — still not a Factory-wide `enabledPlugins`
default. After a local clone:

```bash
# Cursor CLI / similar — SPIKE, not Factory-default
agent --plugin-dir "$PWD/plugins/gitnexus"
```

A later Assistant PR replaces template `.mcp.json` seating. Until then,
do not claim GitNexus is Factory-installed.
