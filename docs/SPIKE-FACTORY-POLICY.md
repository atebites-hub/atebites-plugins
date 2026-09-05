# SPIKE: factory-policy (+ memory gate)

**Status:** SPIKE. Structure + normative field contract + stub skills/hooks.
**Not** a Factory default. **Not** production-enforcing. **Not** a multi-host ship.

This catalog spike scaffolds `plugins/factory-policy/` as an **inline** marketplace
plugin (not a submodule). Host marketplaces do **not** list it. Do not wire
project-factory `enabledPlugins`. Do not treat stub exit 0 as a C3–C7 pass
(no soft-pass).

Binding SoT: Project Factory decisions (Jay 2026-09-05) plus PJTemplate
investigation IDs named below. Do not invent further checks.

## Goal

Replace `reasoning-system` / `sequentialthinking` with **factory-policy**.
factory-policy is the P2 upgraded reasoning-system. It **enforces** the
task-memory ledger; it does not replace the ledger.

`memory-system` **stays nested inside** factory-policy. Do not delete it.
The ledger remains `docs/memories/` in the consumer repo.

CE, taskboard, and j-space are discarded from Factory. They are not defaults
and are not part of this plugin.

## How memory-system nests

```text
plugins/factory-policy/
  skills/policy-gate/      # field contract + how to satisfy C3.x–C7
  skills/memory-system/    # ledger skill (keep the name)
    assets/memory_template.md
  hooks/                   # placeholders → scripts/
  scripts/                 # SPIKE stubs (exit 0, print "SPIKE stub")
```

| Piece | Owns | Does not own |
| --- | --- | --- |
| `memory-system` | How to read/write `docs/memories/` | Enforcement, sequential thinking |
| `policy-gate` | Memory field contract; named checks | Reasoning procedure (native models reason) |
| Hooks / `guard-bash` | When a check *will* run (v1) | Nothing in this spike — stubs only |

Native models fill the fields. The skill does not call `sequentialthinking`.
v1 checkers will read the same fields; they will not judge prose quality.

## Check IDs (C3–C7)

Named investigation IDs. This spike documents them; stubs do **not** enforce them.

| ID | Name | Field / artifact | Satisfy by |
| --- | --- | --- | --- |
| **C3.1** | doc-cited | `Context` under `## Task (TCREI)` | Cite the consumer's mapped cores (via that repo's `document-mapping` / `docs/agents/`). Not a placeholder. |
| **C3.2** | scope-literal | `Scope` under `## Task (TCREI)` | Literal value `inline` or `open-dynamic-workflows`. No synonyms. |
| **C3.3** | plan-filled | `Plan` under `## Task (TCREI)` | Ordered implementation steps; not a placeholder. |
| **C5** | gate-runnable | `Evaluation` under `## Task (TCREI)` | One runnable `Gate: <command>` (exit 0/1). Prose is not a gate. |
| **C6** | issue-linked | Task memory | Cite a tracker issue (URL, `#N`, or `Closes #N`). |
| **C7** | plan-approved | Consumer `docs/plans/` | Task is tied to a human-approved plan. Agents do not sign. |

**C4** is not in the 2026-09-05 investigation ID list delivered to this spike.
Do not invent a C4 contract here.

C1 (`memory-present`) and C2 (`doc-mirror`) stay PJTemplate compliance-script
IDs. factory-policy's named scope is **C3.x–C7**.

## Hook matrix (Claude / Codex / Cursor)

Authoritative local spine is **Tier 1 `guard-bash`** (git), same three-tier
idea as PJTemplate `enforcement_matrix`. Tier 2 harness hooks are accelerators
only. This spike ships placeholders; none enforce.

| Event | Claude Code | Codex | Cursor | v1 intent | This spike |
| --- | --- | --- | --- | --- | --- |
| Policy gate on `src/**` edits | `PreToolUse` (plugin `hooks/claude-codex-hooks.json`) | `PreToolUse` (same JSON shape) | `preToolUse` (`hooks/cursor-hooks.json`) | Inspect tool path; if `src/**`, require C3.x–C7 on the task memory | Stub: `scripts/policy-gate.sh` exits 0 |
| Stop verify + hop cap | `Stop` | `Stop` | `stop` | Re-check ledger; bounce the model until hop cap, then stop looping | Stub: `scripts/stop-verify.sh` exits 0; cap not set |
| Tier 1 git | n/a (host-agnostic) | n/a | n/a | `.githooks` / `core.hooksPath` runs `guard-bash` on staged `src/**` | Stub: `scripts/guard-bash.sh` exits 0 |

v1 PreToolUse must filter to `src/**` (matcher is tool-name; the script reads
stdin JSON for the path). Hop-cap numeric limit is **TBD in v1** — do not
invent a number here.

Grok / ZCode / Hermes / Pi adapters are **later**. Copy-paste scaffolds in
PJTemplate are not this plugin.

## Stub vs later

**In this PR (stub):**

- Spike doc + plugin README labeled SPIKE / not Factory-default until v1
- Skills: `policy-gate` (contract only) and `memory-system` (ledger)
- Host plugin manifests pointing at `./skills`
- `hooks/*.json` pointing at `scripts/`
- Scripts that print `SPIKE stub` and exit 0
- README / FORK-INDEX **Upcoming / P2 spike** mention only

**Later (not this PR):**

- Real C3.1–C3.3 / C5 / C6 / C7 checkers
- Hop-cap implementation
- `src/**` path filter that can block
- Catalog entries, marketplace install commands
- project-factory `enabledPlugins`
- Separate factory-policy git repo / submodule
- Grok/ZCode/Hermes hook adapters
- linear-tracking pin; GitNexus wrap
- Pin bumps of Superpowers / ponytail / Advisor / ODW

## Out of scope

- **No CE** (Compound Engineering). Discarded from Factory. Not a gate.
- **No taskboard / j-space** as defaults or as this plugin's dependencies.
- **No soft-pass.** Stub exit 0 means "not enforcing," not "checks passed."
- **No Factory-default / catalog listing** until v1 is explicitly promoted.
- **No `reasoning-system` / `sequentialthinking` reintroduction.**
- **No `enabledPlugins` wiring** in project-factory from this catalog.
- **No Superpowers / ponytail / Advisor / ODW pin bumps.**

## Catalog posture

Host `marketplace.json` files still list exactly the six catalog plugins.
`plugins/factory-policy/` is in-tree so a later PR can point sources at it
without a submodule. Until v1: document under Upcoming / P2 spike only.

## Success for this spike

PR with this doc + plugin stub; SPIKE labels; memory-system nested;
C3–C7 named; not merged; checks not claimed as production-enforcing.
