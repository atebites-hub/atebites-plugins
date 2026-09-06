# linear-tracking vendor pin

**Status:** Upcoming / **P N** / not a Factory default / not catalog-listed.
**Not** Linear Agent installed. Not Superpowers-class.

Interim skill-body vendor (not a gitlink, not an atebites fork). Jay
prefers vendor + maintain; name stays `linear-tracking`. openai/skills
is **deprecated** and is a multi-skill repo, so this catalog copies
only `skills/.curated/linear/` instead of submoduling the whole tree.
The pin is **interim** until a standalone OSI-licensed plugin repo
appears that can carry a true-fork + `UPSTREAM.md` + weekday sync.

Do not float `main`. Do not catalog-list. Do not wire
`enabledPlugins`.

## Pin (interim skill body)

| Field | Value |
| --- | --- |
| **Upstream** | [openai/skills](https://github.com/openai/skills) |
| **Path** | [`skills/.curated/linear/`](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/linear) |
| **Pin SHA** | `49f948faa9258a0c61caceaf225e179651397431` (openai/skills `main` tip, 2026-09-06) |
| **Last path commit** | `77963424cd7687fd52e5fcfdd3f08d826ab9b1ab` (2026-02-02; `agents/openai.yaml` default_prompt) |
| **SKILL.md last moved** | `ea369035365d5d1fa5102c9f7ec5f1649f7b7030` (curated move; body unchanged through the pin) |
| **License** | Apache-2.0 (`vendor/linear/LICENSE.txt`) |
| **Transport** | Official Linear MCP `https://mcp.linear.app/mcp` (operator OAuth) |
| **Local tree** | `vendor/linear/` (byte copy of the upstream skill folder) |

Do not edit files under `vendor/linear/`. Placement law lives in
`skills/linear-tracking/SKILL.md`.

This SHA is **real** (GitHub `main` tip that contains the curated
skill). It is not Superpowers-class as a marketplace pin. It is the
MCP-CRUD **body** under an atebites placement overlay.

## Why keep this snapshot (honesty vs #34)

[#34](https://github.com/atebites-hub/atebites-plugins/pull/34) is
correct that **no Superpowers-class standalone plugin** exists: nothing
like [obra/superpowers](https://github.com/obra/superpowers) @ v6.3.0 /
`b36e0829c6d0140e93cfef2ca599b1b07d4a7797` for Factory
`linear-tracking`. Official `linear` plugins are host MCP wrappers.
Monorepo gitlinks are out of policy. `linear/cursor-plugin` has no LICENSE.

#34 said “do not vendor the deprecated tree.” This PR keeps a
**folder copy**, not a gitlink, because:

1. Jay lock prefers a vendored pin + maintain (not necessarily
   atebites-authored).
2. The skill is Apache-2.0, names official MCP, and has no secrets.
3. A frozen copy does not depend on the deprecated repo accepting PRs
   or floating `main`.
4. Factory placement stays atebites (`linear-tracking`).

If a standalone OSI-licensed plugin ships, **replace** this snapshot.
Until then: P N, not seatable as Factory default, not catalog-listed.

Known drift (do not “fix” in the vendor tree): some Linear MCP write
tools may now be `save_issue` / `save_project` instead of
`create_issue` / `update_issue` ([openai/skills#203](https://github.com/openai/skills/issues/203)).
Factory placement still names `list_issues`, `list_my_issues`, and
`get_issue` only.

Lane B smoke: `not run — Lane B awaiting Jay credentials`. Missing
MCP is fail-closed, not a pass.

## Candidates inspected (evidence SHAs; not Factory pins)

SHAs below are **real remote tips / path commits** (2026-09-06,
[#34](https://github.com/atebites-hub/atebites-plugins/pull/34) via
GitHub API + `git ls-remote`). They are **not** marketplace pins
except the interim skill-body copy of openai/skills HEAD recorded
above. Do **not** copy the others into `.gitmodules`. Factory Plugins
bot: do not create `atebites-hub/linear` from these remotes.

| Candidate | What it is | Evidence SHA (2026-09-06) | Why it is not a Factory pin |
| --- | --- | --- | --- |
| [linear/cursor-plugin](https://github.com/linear/cursor-plugin) | Official Cursor plugin `linear` 1.0.0: `.cursor-plugin/plugin.json` + `mcp.json` → `https://mcp.linear.app/mcp`. No skills. no LICENSE on the repo. | HEAD `c2c4cb2ab23206c9219b0dd31c9571e4c922faeb` (2026-02-10) | Cursor-only. Unlicensed public tree — bot cannot honestly weekday-sync a fork. Marketplace Browse install, not Superpowers-class. Installing it would look like Linear Agent / official Linear skills shipped. Does not teach `Closes BLA-n` or no-auto-delegate. |
| [openai/plugins](https://github.com/openai/plugins) `plugins/linear` | Official Codex/ChatGPT **app-backed** plugin `linear` **5.0.1**. README: connector + hosted MCP + metadata; **no bundled skills**. MIT on the plugin manifest. | Monorepo HEAD `1e285826e604f66f7208f7ac4dba0fe8341d1f57` (2026-08-28). Last path commit `33bd9529725fcee78c9e51fcbaa93cd963c3a47b` (2026-08-26). | Not a standalone product repo. Gitlinking HEAD would vendor the entire OpenAI plugin catalog. App id `asdk_app_69a089a326dc8191b32a3f2553f5be2c` / ON_INSTALL OAuth — ChatGPT connector, not Factory placement. |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) `external_plugins/linear` | Official Claude `linear` plugin: `.claude-plugin/plugin.json` + `.mcp.json` → official MCP. Author Linear. No skills. Repo Apache-2.0. | Monorepo HEAD `85cce0381e7860082641b59d961a2b8c368b8b79`. Last path commit `ab2b6d0cad88ead3da5466ef2acef0c4a351971e` (2025-12-16). | Claude-only subtree of Anthropic's official marketplace. Same monorepo-gitlink reject as openai/plugins. |
| [openai/skills](https://github.com/openai/skills) `skills/.curated/linear` | Codex **skill** (Apache-2.0) over official Linear MCP. Tool names include `list_issues`, `list_my_issues`, `get_issue`. Parent README: **repository is deprecated** (use openai/plugins). | Monorepo HEAD `49f948faa9258a0c61caceaf225e179651397431`. Last path commit `77963424cd7687fd52e5fcfdd3f08d826ab9b1ab` (2026-02-02). | **Interim body only.** Deprecated monorepo. Skill-only, not a multi-host plugin. CRUD workflows, not Factory placement. Not a weekday-sync fork. Copied here as frozen skill body + overlay; replace when a standalone OSI-licensed plugin appears. |
| Third-party `linear-skill` repos | Various GraphQL CLIs / OpenClaw skills | not enumerated | Spike **rejects** an atebites-authored Linear client and in-tree secrets. Do not fork a random GraphQL wrapper. |
| [linear/linear](https://github.com/linear/linear) | Official TypeScript SDK monorepo (`packages/sdk`, …). MIT. | not used as a pin | SDK, not a host plugin. Vendoring it would be writing a Linear API client — rejected. |
| PJTemplate `linear-driven-flow.md` | Spike SoT cited **by name** | **absent** on [atebites-hub/PJTemplate](https://github.com/atebites-hub/PJTemplate) `main` (rechecked 2026-09-06) | Still not a pin source. Do not invent further tracker law. |

Transport is already known: official Linear MCP. A pin of `mcp.json`
alone is not a skill, not Factory placement, and not worth a gitlink.

## Divergence (atebites-only; not in the vendor tree)

| Piece | Why |
| --- | --- |
| `skills/linear-tracking/SKILL.md` | Factory placement overlay (session start; `Closes BLA-n`; no auto-delegate). Name stays `linear-tracking`. |
| Host `plugin.json` wraps | Thin manifests. Skills path is `./skills` (placement). Not catalog-listed. |
| This file + `NOTICE` | Pin record + Apache-2.0 attribution + #34 rejection table |

## Sync (interim; not a weekly fork loop)

1. Do **not** float openai/skills `main`. Do not gitlink openai/plugins
   or anthropics/claude-plugins-official.
2. Factory Plugins bot: **do not fork yet.** Wait for a standalone
   OSI-licensed plugin repo; then true-fork + weekday sync; then this
   catalog may pin after CI + [smoke](../../docs/FORK-MAINTENANCE.md#smoke-matrix).
3. If this snapshot must be refreshed before that: copy
   `skills/.curated/linear/` over `vendor/linear/` from a reviewed SHA
   and update this file. Do not rewrite the skill body.
4. Do not add a catalog row or project-factory `enabledPlugins` in a
   pin-bump PR.
