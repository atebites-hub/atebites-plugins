# SPIKE: linear-tracking (marketplace path)

**Status:** Vendored pin chosen. Still SPIKE / Upcoming. **Not** a
Factory default. **Not** catalog-listed. **Not** wired into
project-factory `enabledPlugins`. **Not** a claim that Linear Agent
skills are installed.

This catalog path keeps `plugins/linear-tracking/` as an **upcoming**
inline wrap (not a submodule of openai/skills), the same class as
host-adapters. Host marketplaces do **not** list it. Do not invent
Linear API secrets. Do not treat missing MCP as a working tracker (no
soft-pass).

The pack name is **`linear-tracking`**. Jay lock (2026-09-05): **keep
linear-tracking**. It replaces discarded `taskboard-workflow`. Factory
discarded taskboard; this path is the tracker follow-up, still **P N**.

Spec inspiration: PJTemplate investigation `linear-driven-flow.md` §3
skill `linear-tracking`. That file is **not** on
[atebites-hub/PJTemplate](https://github.com/atebites-hub/PJTemplate)
`main` as of this spike (2026-09-05); it is cited **by name**. Placement
rules below come from that section plus the Jay lock. Do not invent
further tracker law.

## Binding SoT (do not invent ownership)

| Piece | Owns | Does not own |
| --- | --- | --- |
| **`linear-tracking` skill** | Factory placement: session start find issue; `Closes BLA-n` in the PR body; no auto-delegate to Cursor on every issue | Linear API client; MCP tool schemas; Linear Agent; factory-policy C6 enforcement |
| **Official Linear MCP** (`https://mcp.linear.app/mcp`) | Authenticated issue read/write (OAuth / operator token) | Secrets in this repo; Factory placement; catalog promotion |
| **factory-policy C6** | Memory cites a tracker issue (`- **Linear**: KEY-123`, URL, `#N`) | Finding the issue at session start; writing PR magic words |
| **Linear GitHub integration** | Closing / non-closing magic words on PR title or body | Session start; agent delegation |
| **Linear Agent / `@Cursor`** | Operator-gated delegation (assign / mention / triage rule) | Factory-default auto-assign of every issue |
| **taskboard / CE / j-space** | Discarded from Factory | This path |

factory-policy v1 already landed ([#29](https://github.com/atebites-hub/atebites-plugins/pull/29)).
This spike does **not** change that plugin. C6 stays the memory citation
check. linear-tracking is how an agent **finds** the Linear issue and
**closes** it from a PR.

## Pin (chosen)

Jay lock: prefer a **vendored pin** of an existing skill/plugin and
**upstream maintain** that pin (not necessarily atebites-authored). Same
class as the Superpowers pin-only submodule: pin a SHA after review; do
not float `main`. openai/skills is a multi-skill repo, so this pin is a
**vendored copy** of one skill folder plus `UPSTREAM.md`, not a gitlink
of the whole repo.

| Field | Value |
| --- | --- |
| **Upstream** | https://github.com/openai/skills |
| **Path** | `skills/.curated/linear/` |
| **SHA** | `49f948faa9258a0c61caceaf225e179651397431` (openai/skills `main` tip, 2026-09-06) |
| **Local tree** | `plugins/linear-tracking/vendor/linear/` |
| **Transport** | official Linear MCP `https://mcp.linear.app/mcp` (operator OAuth) |

openai/skills README is **deprecated** (points at openai/plugins). Still
the best MCP-CRUD skill: official MCP URL, OAuth, tool names, no
secrets. openai/plugins `plugins/linear` @
`1e285826e604f66f7208f7ac4dba0fe8341d1f57` is an app-backed connector
**with no bundled skills** — not clearly superior, not a skill pin.
Rejected: atebites-authored Linear GraphQL/REST or baked
`LINEAR_API_KEY`.

The Factory skill **name stays `linear-tracking`**. The vendored body
stays named `linear`. Placement overlay wins on the three rules.

Do not claim the vendored skill is Factory-installed.

## Required behaviors (investigation §3)

Normative for the placement skill. Short. Tool **names** only — do not
bake MCP schemas.

1. **Session start — find the issue.** Use official Linear MCP
   `list_issues`, `list_my_issues`, and/or `get_issue` to locate the
   issue this session is for. Do not invent a Linear id. If MCP is not
   connected / not authenticated, **fail closed**: say so. That is not a
   pass.
2. **PR body — `Closes BLA-n`.** Put a Linear closing magic word plus
   the issue id in the **PR body** (title also works; a later comment
   does not). Investigation example: `Closes BLA-n`. `BLA` is the
   example team key, not a claimed atebites team. Real workspaces use
   their own key (`Closes ENG-123`). Other closing words (`Fixes`,
   `Resolves`, …) are Linear's; Factory wording is `Closes BLA-n`.
3. **No auto-delegate to Cursor on every issue.** Do not turn on Linear
   triage rules / Linear Agent / `@Cursor` so that **every** incoming
   issue launches a Cursor Cloud Agent. Delegation is operator-gated
   (human assigns or mentions). This catalog does **not** install Linear
   Agent skills.

Optional later (not this pin): `update_issue` status, `create_comment`
progress notes. Still no invented secrets.

## Goal

Give the marketplace an **upcoming-only** seat for the tracker that
replaces `taskboard-workflow`, with a real vendor SHA, without
promoting it, without a fake pin, and without soft-passing Linear as
installed.

## Layout

```text
plugins/linear-tracking/
  README.md                      # upcoming / not Factory-default / not catalog-listed
  UPSTREAM.md                    # pin URL + SHA
  NOTICE                         # Apache-2.0 vendor attribution
  plugin.json                    # thin placeholder
  .cursor-plugin/plugin.json
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
  .grok-plugin/plugin.json
  .zcode-plugin/plugin.json
  skills/linear-tracking/SKILL.md
  vendor/linear/                 # openai/skills curated linear @ 49f948fa…
```

No MCP config with secrets. No gitlink.

## In scope (this pin PR)

- Binding spike doc at `docs/SPIKE-LINEAR-TRACKING.md`
- Vendored copy of openai/skills `skills/.curated/linear/` @
  `49f948faa9258a0c61caceaf225e179651397431`
- Factory placement skill with the three rules
- Thin host `plugin.json` placeholders pointing at `./skills`
- README / FORK-INDEX **Upcoming / P2 spike** mention only

## Out of scope

- **No Factory-default / catalog listing / `enabledPlugins`.**
- **No Superpowers / ponytail / Advisor / ODW pin bumps.**
- **No factory-policy v1 edits** (already landed; leave the checkers).
- **No invented Linear API secrets** (`LINEAR_API_KEY`, bearer tokens,
  workspace OAuth clients in-tree).
- **No soft-pass.** Missing MCP is not "tracking works."
- **No claim that Linear Agent skills are installed.**
- **No auto-delegate-every-issue** as a Factory default.
- **No taskboard / CE / j-space** as defaults or as this plugin's
  dependencies. Do not reintroduce `taskboard-workflow`.
- **No GitNexus wrap** in this PR.

## Catalog posture

Host `marketplace.json` files still list the existing catalog plugins
only. `plugins/linear-tracking/` is in-tree so a later PR can point
sources at it, without a catalog row today. Until promotion: document
under Upcoming / P2 spike only.

## This pin vs later

**In this PR (vendored pin, still upcoming):**

- Spike doc + plugin README labeled SPIKE / upcoming / not Factory-default
- Vendor tree + `UPSTREAM.md` SHA
- Skill: placement rules + pointer at the pin
- Thin host manifests
- README / FORK-INDEX **Upcoming / P2 spike** mention only

**Later (not this PR):**

- Operator OAuth to official Linear MCP (Jay credentials; Lane B)
- Catalog entry or Factory-default promotion
- project-factory `enabledPlugins`
- Any Linear Agent / `@Cursor` automation (still operator-gated)
- Pin bump after review if upstream skill body moves

## Success for this pin

PR with this doc + vendor SHA + placement skill; SPIKE / upcoming-only
labels; pin recorded (vendor + upstream maintain); three placement
rules present; no catalog row; no Factory kept-list entry; no invented
secrets; not merged as a Factory default.
