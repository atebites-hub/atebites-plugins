# linear-tracking vendor pin

Skill-only vendor (not a gitlink, not an atebites fork). Same class as a
Superpowers pin: record a SHA and maintain it; do not float `main`.
openai/skills is a multi-skill repo, so this catalog copies only
`skills/.curated/linear/` instead of submoduling the whole tree.

## Pin

| Field | Value |
| --- | --- |
| **Upstream** | [openai/skills](https://github.com/openai/skills) |
| **Path** | [`skills/.curated/linear/`](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/linear) |
| **Pin SHA** | `49f948faa9258a0c61caceaf225e179651397431` (openai/skills `main` tip, 2026-09-06) |
| **Skill last changed** | `ea369035365d5d1fa5102c9f7ec5f1649f7b7030` (move to curated; body unchanged through the pin) |
| **License** | Apache-2.0 (`vendor/linear/LICENSE.txt`) |
| **Transport** | Official Linear MCP `https://mcp.linear.app/mcp` (operator OAuth) |
| **Local tree** | `vendor/linear/` (byte copy of the upstream skill folder) |

Do not edit files under `vendor/linear/`. Placement law lives in
`skills/linear-tracking/SKILL.md`.

## Why this pin (not openai/plugins)

[openai/skills](https://github.com/openai/skills) README is marked
**deprecated** in favor of [openai/plugins](https://github.com/openai/plugins).
That successor’s Linear package (`plugins/linear` @
`1e285826e604f66f7208f7ac4dba0fe8341d1f57`) is now an **app-backed
connector with no bundled skills** (README: “no bundled skills”). It is
not a portable MCP-CRUD workflow.

Community alternatives (for example wrsmith108/linear-claude-skill) add
`LINEAR_API_KEY`, GraphQL, or SDK clients. Jay lock: no invented Linear
API client and no secrets in this repo.

So the curated `linear` skill on openai/skills remains the best
pin-able MCP-CRUD body: official `https://mcp.linear.app/mcp`, OAuth,
tool **names** only, no API key.

Known drift (do not “fix” in the vendor tree): some Linear MCP write
tools may now be `save_issue` / `save_project` instead of
`create_issue` / `update_issue` ([openai/skills#203](https://github.com/openai/skills/issues/203)).
Factory placement still names `list_issues`, `list_my_issues`, and
`get_issue` only.

## Divergence (atebites-only; not in the vendor tree)

| Piece | Why |
| --- | --- |
| `skills/linear-tracking/SKILL.md` | Factory placement overlay (session start; `Closes BLA-n`; no auto-delegate). Name stays `linear-tracking`. |
| Host `plugin.json` wraps | Thin manifests. Skills path is `./skills` (placement). Not catalog-listed. |
| This file + `NOTICE` | Pin record + Apache-2.0 attribution |

## Sync (pin bump, not a weekly fork loop)

1. Resolve a new openai/skills commit that still contains
   `skills/.curated/linear/`.
2. Copy that folder over `vendor/linear/` (replace, do not rewrite).
3. Update the pin SHA here, in `docs/SPIKE-LINEAR-TRACKING.md`, and in
   the plugin README.
4. Bump only after review. Do not float `main`. Do not add a catalog
   row or project-factory `enabledPlugins` in a pin-bump PR.
