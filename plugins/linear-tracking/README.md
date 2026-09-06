# linear-tracking

**SPIKE — upcoming / P N / not a Factory default. Not catalog-listed.**

Interim vendored skill body plus Factory placement overlay in
[atebites-plugins](https://github.com/atebites-hub/atebites-plugins).
Not Superpowers-class. Not a submodule of openai/skills. Not listed
in host catalogs. Not wired into project-factory `enabledPlugins`.
Replaces discarded `taskboard-workflow`. Do not claim Linear Agent skills installed.
Upstream openai/skills is **deprecated** — this pin
is interim until a standalone OSI-licensed plugin appears.

Normative scope: [`docs/SPIKE-LINEAR-TRACKING.md`](../../docs/SPIKE-LINEAR-TRACKING.md).
Pin record + #34 rejection table: [`UPSTREAM.md`](UPSTREAM.md).

Jay lock: keep the name **`linear-tracking`**. Vendor + upstream
maintain (not necessarily atebites-authored).

## Pin

| Field | Value |
| --- | --- |
| Upstream | [openai/skills](https://github.com/openai/skills) `skills/.curated/linear/` |
| SHA | `49f948faa9258a0c61caceaf225e179651397431` |
| Local tree | `vendor/linear/` |
| Transport | official Linear MCP `https://mcp.linear.app/mcp` (operator OAuth) |

openai/skills is **deprecated**; the curated `linear` skill is still
the best interim MCP-CRUD **body** (not a Factory pin). Official
`linear` host plugins are MCP wrappers or catalog subtrees — see
`UPSTREAM.md`. Do not invent a Linear API client or secrets.

## What this is

Factory tracker **placement** on top of the official Linear MCP. The
placement skill is the Factory layer. The vendored skill is the MCP
CRUD workflow. MCP is the transport. factory-policy C6 still owns the
memory citation (`- **Linear**: KEY-123`).

## Skills

| Skill | Role |
| --- | --- |
| `linear-tracking` | Session start find issue; `Closes BLA-n` in the PR body; no auto-delegate to Cursor on every issue |
| `vendor/linear` (`linear`) | Vendored MCP-CRUD workflow (not the Factory name) |

Linear MCP tool **names** (no schemas): `list_issues`,
`list_my_issues`, `get_issue`. Optional later: `update_issue`,
`create_comment`.

If MCP is not authenticated, fail closed. That is not a pass.

## Not in this plugin

- Catalog install as a factory-default
- CE, taskboard, j-space (discarded from Factory — not defaults)
- Linear Agent / `@Cursor` auto-delegate of every issue
- Invented `LINEAR_API_KEY` / bearer tokens
- factory-policy checkers (already v1; do not edit them here)

## Opt-in (upcoming only)

Hosts do not install this from the marketplace. After a local clone:

```bash
# Cursor CLI / similar — SPIKE, not Factory-default, not catalog-listed
agent --plugin-dir "$PWD/plugins/linear-tracking"
```

A later PR is required before this becomes a catalog plugin or a
Factory default. Status stays **P N** until a standalone OSI-licensed
upstream exists.
