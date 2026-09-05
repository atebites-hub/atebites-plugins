# SPIKE: linear-tracking (marketplace path)

**Status:** SPIKE. Ownership + pin strategy + stub skill.
**Not** a Factory default. **Not** catalog-listed. **Not** wired into
project-factory `enabledPlugins`. **Not** a claim that Linear Agent
skills are installed.

This catalog spike scaffolds `plugins/linear-tracking/` as an **inline**
upcoming stub (not a submodule), the same class as early factory-policy
and host-adapters. Host marketplaces do **not** list it. Do not invent
Linear API secrets. Do not treat the stub as a working tracker (no
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

## Pin strategy (prefer vendor + upstream maintain)

Jay lock: prefer a **vendored pin of an existing skill/plugin**, then
maintain that pin against upstream. The product does **not** have to be
atebites-authored. Same class as the Superpowers pin-only submodule: pin
a SHA after CI + smoke; do not float `main`.

| Option | When | This spike |
| --- | --- | --- |
| **Preferred: vendor existing skill/plugin** | An upstream Linear skill/plugin already covers MCP workflow | Do **not** invent a SHA. Do **not** vendor a tree yet. |
| **Thin atebites wrap** | Upstream is not already a multi-host plugin (j-space / taskboard wrap pattern) | Wrap exposes the vendored skill + this placement skill. Wrap does not invent a Linear API. |
| **Rejected: atebites-authored Linear client** | No suitable upstream | Do not write GraphQL/REST wrappers or bake `LINEAR_API_KEY`. |

Candidate **transport** (not a skill, not selected as a pin): official
Linear MCP at `https://mcp.linear.app/mcp` (OAuth). Operator authenticates
in the host. This repo stores no API keys.

Candidate **upstream skills** (examples only; no SHA; not selected):

- Existing Linear MCP workflow skills (for example the openai/skills
  curated `linear` skill) — CRUD against official MCP. They are **not**
  Factory placement and are **not** claimed installed here.
- A later Linear-authored skill, if one ships as a pin-able plugin.

The Factory skill **name stays `linear-tracking`** even if the body is
mostly a vendored pin plus a thin placement overlay.

Do not claim any of those candidates are Factory-installed.

## Required behaviors (investigation §3)

Normative for the stub skill. Short. Tool **names** only — do not bake
MCP schemas.

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

Optional later (not this stub): `update_issue` status, `create_comment`
progress notes. Still no invented secrets.

## Goal

Give the marketplace an **upcoming-only** seat for the tracker that
replaces `taskboard-workflow`, without promoting it, without a fake pin,
and without soft-passing Linear as installed.

## Layout

```text
plugins/linear-tracking/
  README.md                      # upcoming / not Factory-default / not catalog-listed
  plugin.json                    # thin placeholder
  .cursor-plugin/plugin.json
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
  .grok-plugin/plugin.json
  .zcode-plugin/plugin.json
  skills/linear-tracking/SKILL.md
```

No MCP config with secrets. No vendor tree. No gitlink.

## In scope (this spike)

- Binding spike doc at `docs/SPIKE-LINEAR-TRACKING.md`
- Inline stub under `plugins/linear-tracking/` (not a submodule)
- Skill stub with the three placement rules
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
- **No vendor SHA / submodule** until a later pin PR after CI + smoke.

## Catalog posture

Host `marketplace.json` files still list exactly the six catalog plugins.
`plugins/linear-tracking/` is in-tree so a later PR can point sources at
it or replace the stub with a vendored pin, without a catalog row today.
Until promotion: document under Upcoming / P2 spike only.

## Stub vs later

**In this PR (stub):**

- Spike doc + plugin README labeled SPIKE / upcoming / not Factory-default
- Skill: placement rules only
- Thin host manifests
- README / FORK-INDEX **Upcoming / P2 spike** mention only

**Later (not this PR):**

- Choose and pin an upstream skill/plugin SHA (vendor + maintain)
- Thin wrap only if hosts need it
- Operator OAuth to official Linear MCP (Jay credentials; Lane B)
- Catalog entry or Factory-default promotion
- project-factory `enabledPlugins`
- Any Linear Agent / `@Cursor` automation (still operator-gated)

## Success for this spike

PR with this doc + stub skill; SPIKE / upcoming-only labels; pin
strategy recorded (vendor + upstream maintain); three placement rules
present; no catalog row; no Factory kept-list entry; no invented
secrets; not merged as a Factory default.
