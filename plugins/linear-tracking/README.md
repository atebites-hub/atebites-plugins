# linear-tracking

**SPIKE — upcoming / not a Factory default. Not catalog-listed yet.**

Inline marketplace **stub** in
[atebites-plugins](https://github.com/atebites-hub/atebites-plugins).
Not a submodule. Not listed in host catalogs. Not wired into
project-factory `enabledPlugins`. Replaces discarded
`taskboard-workflow`. Do not claim Linear Agent skills installed.

Normative spike scope: [`docs/SPIKE-LINEAR-TRACKING.md`](../../docs/SPIKE-LINEAR-TRACKING.md).

Jay lock: keep the name **`linear-tracking`**. Prefer a **vendored pin
of an existing skill/plugin** and maintain that pin against upstream
(not necessarily atebites-authored). This stub does not vendor a tree
and does not invent a SHA. Pin readiness (2026-09-06): **P N** /
blocked. Official `linear` plugins are host MCP wrappers, not a
Factory pin. See [`docs/PIN-LINEAR-TRACKING.md`](../../docs/PIN-LINEAR-TRACKING.md).

## What this is

Factory tracker placement on top of the **official Linear MCP**
(`https://mcp.linear.app/mcp`, OAuth). The skill is the placement
layer. MCP is the transport. factory-policy C6 still owns the memory
citation (`- **Linear**: KEY-123`).

## Skill

| Skill | Role |
| --- | --- |
| `linear-tracking` | Session start find issue; `Closes BLA-n` in the PR body; no auto-delegate to Cursor on every issue |

Linear MCP tool **names** (no schemas in this stub): `list_issues`,
`list_my_issues`, `get_issue`. Optional later: `update_issue`,
`create_comment`.

If MCP is not authenticated, fail closed. That is not a pass.

## Not in this plugin

- Catalog install as a factory-default
- CE, taskboard, j-space (discarded from Factory — not defaults)
- Linear Agent / `@Cursor` auto-delegate of every issue
- Invented `LINEAR_API_KEY` / bearer tokens
- factory-policy checkers (already v1; do not edit them here)

## Opt-in (spike only)

Hosts do not install this from the marketplace. After a local clone:

```bash
# Cursor CLI / similar — SPIKE, not Factory-default, not catalog-listed
agent --plugin-dir "$PWD/plugins/linear-tracking"
```

A later pin PR is required before this becomes a catalog plugin or a
Factory default.
