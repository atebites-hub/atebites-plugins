# linear-tracking pin readiness

**Status:** **P N**. Pin blocked. Not installed. Not catalog-listed.
Not a Factory default. Not wired into project-factory `enabledPlugins`.
**Not** a Linear Agent skill install.

SPIKE stub already merged
([#30](https://github.com/atebites-hub/atebites-plugins/pull/30)):
[`SPIKE-LINEAR-TRACKING.md`](SPIKE-LINEAR-TRACKING.md) plus inline
`plugins/linear-tracking/`. This note is the next marketplace step: an
honest investigation of whether a **seatable vendor pin** exists. It does
**not** add a gitlink, invent a SHA, or soft-pass Linear as installed.

Verified **2026-09-06** via GitHub API + `git ls-remote` (no Lane B box;
no Linear OAuth in this environment).

## Verdict

**Do not open a pin PR.** No maintainable Superpowers-class upstream
exists for Factory `linear-tracking`. Official Linear plugins are
**host-specific MCP wrappers** named `linear` (transport only). They do
not encode Factory placement (session start find issue; `Closes BLA-n`
in the PR body; no auto-delegate to Cursor on every issue). Two of the
three official wrappers live as **subtrees of other vendors' catalogs**,
which this marketplace does not gitlink.

Factory status stays **P N**. Same class as factory-dogfood /
project-factory: do not soft-pass.

## Binding SoT (do not invent ownership)

Unchanged from the spike. Fork/pin gitlinks stay with **Jaskarn** and
**Factory Plugins bot** ([FORK-MAINTENANCE.md](FORK-MAINTENANCE.md)).
This catalog PR does **not** create an atebites-hub Linear fork, does
**not** add a submodule, and does **not** take bot-owned sync loops.

| Piece | Owns | Does not own |
| --- | --- | --- |
| **`linear-tracking` stub** | Factory placement rules (inline skill) | Linear API client; official host plugins; vendor gitlink |
| **Official Linear MCP** (`https://mcp.linear.app/mcp`) | Authenticated issue read/write (OAuth / operator token) | Secrets in this repo; catalog promotion; a pin SHA |
| **Factory Plugins bot** | Future true-fork + `UPSTREAM.md` + weekday sync **after** a standalone OSI-licensed upstream exists | Inventing a vendor SHA; forking unlicensed / monorepo wrappers from this note |
| **factory-policy C6** | Memory cites a tracker issue | Finding the issue; PR magic words |
| **Lane B (Jay credentials)** | Operator OAuth + live smoke | Fake green from docs |

## Candidates inspected (evidence SHAs; none selected)

SHAs below are **real remote tips / path commits**, recorded so a later
agent cannot invent one. They are **not** marketplace pins. Do **not**
copy them into `.gitmodules`.

| Candidate | What it is | Evidence SHA (2026-09-06) | Why it is not a Factory pin |
| --- | --- | --- | --- |
| [linear/cursor-plugin](https://github.com/linear/cursor-plugin) | Official Cursor plugin `linear` 1.0.0: `.cursor-plugin/plugin.json` + `mcp.json` → `https://mcp.linear.app/mcp`. No skills. No LICENSE on the repo. | HEAD `c2c4cb2ab23206c9219b0dd31c9571e4c922faeb` (2026-02-10) | Cursor-only. Unlicensed public tree — Factory Plugins bot cannot honestly `UPSTREAM.md` / weekday-sync a fork. Marketplace Browse install, not a Superpowers-class pin. Installing it would look like Linear Agent / official Linear skills shipped. Does not teach `Closes BLA-n` or no-auto-delegate. |
| [openai/plugins](https://github.com/openai/plugins) `plugins/linear` | Official Codex/ChatGPT **app-backed** plugin `linear` **5.0.1**. README: connector + hosted MCP + metadata; **no bundled skills**. MIT on the plugin manifest. | Monorepo HEAD `1e285826e604f66f7208f7ac4dba0fe8341d1f57` (2026-08-28). Last path commit `33bd9529725fcee78c9e51fcbaa93cd963c3a47b` (2026-08-26). | Not a standalone product repo. Gitlinking HEAD would vendor the entire OpenAI plugin catalog. App id `asdk_app_69a089a326dc8191b32a3f2553f5be2c` / ON_INSTALL OAuth — ChatGPT connector, not Factory placement. |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) `external_plugins/linear` | Official Claude `linear` plugin: `.claude-plugin/plugin.json` + `.mcp.json` → official MCP. Author Linear. No skills. Repo Apache-2.0. | Monorepo HEAD `85cce0381e7860082641b59d961a2b8c368b8b79`. Last path commit `ab2b6d0cad88ead3da5466ef2acef0c4a351971e` (2025-12-16). | Claude-only subtree of Anthropic's official marketplace. Same monorepo-gitlink reject as openai/plugins. |
| [openai/skills](https://github.com/openai/skills) `skills/.curated/linear` | Codex **skill** (Apache-2.0) over official Linear MCP. Tool names include `list_issues`, `list_my_issues`, `get_issue`. Parent README: **repository is deprecated** (use openai/plugins). | Monorepo HEAD `49f948faa9258a0c61caceaf225e179651397431`. Last path commit `77963424cd7687fd52e5fcfdd3f08d826ab9b1ab` (2026-02-02). | Deprecated monorepo. Skill-only, not a multi-host plugin. CRUD workflows, not Factory placement. Spike already cited this as an example, not a pin. Do not vendor the deprecated tree. |
| Third-party `linear-skill` repos | Various GraphQL CLIs / OpenClaw skills | not enumerated | Spike **rejects** an atebites-authored Linear client and in-tree `LINEAR_API_KEY`. Do not fork a random GraphQL wrapper. |
| [linear/linear](https://github.com/linear/linear) | Official TypeScript SDK monorepo (`packages/sdk`, …). MIT. | not used as a pin | SDK, not a host plugin. Vendoring it would be writing a Linear API client — rejected. |
| PJTemplate `linear-driven-flow.md` | Spike SoT cited **by name** | **absent** on [atebites-hub/PJTemplate](https://github.com/atebites-hub/PJTemplate) `main` (rechecked 2026-09-06; `docs/` has no `linear-driven-flow.md`) | Still not a pin source. Do not invent further tracker law. |

Transport is already known: official Linear MCP. A pin of `mcp.json` alone
is not a skill, not Factory placement, and not worth a gitlink.

## Blockers (why option B is closed)

1. **No standalone pin-able product.** Superpowers works because
   [obra/superpowers](https://github.com/obra/superpowers) is one repo,
   OSI-licensed, tagged `v6.3.0`, pinned at
   `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`. Nothing equivalent exists
   for Factory `linear-tracking`.
2. **Official plugins ≠ Factory skill.** They are named `linear`, host
   MCP connectors, and do not own session-start / `Closes BLA-n` /
   no-auto-delegate. Catalog-listing them would claim Linear installed.
3. **Monorepo gitlinks are out of policy.** This catalog's `.gitmodules`
   are dedicated product repos (or j-space's dedicated vendor suite).
   Sparse-checkout of `plugins/linear` is not a pattern here.
4. **Unlicensed Cursor tree.** `linear/cursor-plugin` has no LICENSE.
   Factory Plugins bot should not open `atebites-hub/cursor-plugin` /
   `atebites-hub/linear` from that tree.
5. **Lane B smoke is not run.** Operator OAuth is Jay credentials.
   Record `not run — Lane B awaiting Jay credentials`. Missing MCP is a
   fail-closed, not a pass.
6. **Placement overlay is still atebites.** Even a future vendor pin
   needs the Factory skill **name** `linear-tracking`. That overlay is
   not a reason to fake a vendor SHA today.

## Exact next vendor / fork actions

Do these in order. Do **not** invent a SHA to skip a step.

1. **Factory Plugins bot + Jaskarn — wait; do not fork yet.**
   Do not create `atebites-hub/linear`, `atebites-hub/linear-tracking`,
   or a true-fork of `linear/cursor-plugin` until Linear (or another
   vendor) publishes a **standalone**, **OSI-licensed** plugin repo
   that can carry `UPSTREAM.md` + weekday `sync-upstream.yml`. When that
   repo exists: true-fork if GitHub parent-link is possible; record
   upstream URL + base SHA; sync on weekdays. Then this catalog may pin
   **after** fork CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix).
2. **Factory Plugins bot — do not gitlink monorepos.**
   `openai/plugins` `1e285826e604f66f7208f7ac4dba0fe8341d1f57` and
   `anthropics/claude-plugins-official`
   `85cce0381e7860082641b59d961a2b8c368b8b79` stay evidence only.
3. **Jay / Lane B — operator OAuth.**
   Authenticate official Linear MCP on a box. Required before any pin
   smoke. Until then: `not run — Lane B awaiting Jay credentials`.
4. **This catalog — keep the stub.**
   No catalog row. No `enabledPlugins`. No Factory-default. Status
   **P N**. A later pin PR is allowed only after step 1 produces a real
   standalone SHA that survives CI + smoke.
5. **Thin wrap only if step 1 never happens.**
   Keep the atebites placement skill. Transport stays official MCP.
   Do not write GraphQL/REST. Do not bake `LINEAR_API_KEY`. A wrap
   without a vendor tree is still **not** a pin.
6. **Re-evaluate openai/skills `linear` only if extracted.**
   If the deprecated curated skill moves into its own maintained repo,
   it may become wrap **body** (MCP workflow). It still needs the
   Factory placement overlay and is still not Linear Agent.

## Success for this note

Marketplace moved one honest step: blockers and next actions are
written down with real evidence SHAs, status **P N**, no gitlink, no
catalog row, no invented secrets, no "installed" claim. Factory
Plugins bot can wait without guessing a vendor.
