# SPIKE: factory-policy (+ memory gate)

**Superseded (2026-09-05).** v1 warn-default enforcement landed in
[`plugins/factory-policy/`](../plugins/factory-policy/). Current status:
[POLICY-V1.md](POLICY-V1.md). Scripts no longer print `SPIKE stub` as a
treatable pass. This file is the historical scaffold note.

**Status at spike time:** SPIKE. Structure + normative field contract + stub
skills/hooks. That stub era is over for the checkers named below. The plugin
is still **not** a Factory default, **not** catalog-listed, and **not** wired
into project-factory `enabledPlugins`.

This catalog spike scaffolded `plugins/factory-policy/` as an **inline**
marketplace plugin (not a submodule). Host marketplaces do **not** list it.
Do not wire project-factory `enabledPlugins`. Do not treat stub exit 0 as a
C3–C7 pass (no soft-pass).

## Binding SoT (do not invent)

C3–C7 source of truth is **exactly** the PJTemplate handoff trio:

1. `factory-01-policy-layer.md`
2. `policy-gate.md`
3. **Build Sheet §5** (PJTemplate handoff)

This catalog has no local PJTemplate clone. Those files are **not** on
[atebites-hub/PJTemplate](https://github.com/atebites-hub/PJTemplate) `main`
as of this spike (2026-09-05); they are cited **by name** as the Assistant
lock. Check IDs, hook names, and the memory-field contract below come from
that trio plus Project Factory decisions (Jay 2026-09-05). Do not add
checks those documents do not name.

Jay 2026-09-05 (Factory): factory-policy (+ memory gate) is the P2 upgraded
reasoning-system; `memory-system` remains the ledger (`docs/memories/`);
CE / taskboard / j-space are discarded from Factory (not defaults).

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
  hooks/                   # pointers → scripts/
  scripts/                 # v1 checkers (see POLICY-V1.md)
```

| Piece | Owns | Does not own |
| --- | --- | --- |
| `memory-system` | How to read/write `docs/memories/` | Enforcement, sequential thinking |
| `policy-gate` | Memory field contract; named checks | Reasoning procedure (native models reason) |
| Hooks / `guard-bash` | When a check runs | Catalog promotion / Factory default |

Native models fill the fields. The skill does not call `sequentialthinking`.
v1 checkers read the same fields; they do not judge prose quality.

## Check IDs (C3–C7)

Named investigation IDs. v1 enforces C3.1–C3.3, C5, and C6 (warn-default).

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
only.

| Event | Claude Code | Codex | Cursor | v1 intent |
| --- | --- | --- | --- | --- |
| Policy gate on `src/**` edits | `PreToolUse` | `PreToolUse` | `preToolUse` | Inspect tool path; if `src/**`, require C3.x–C6 on the task memory |
| Stop verify + hop cap | `Stop` | `Stop` | `stop` | Re-check ledger; hop-cap numeric limit still TBD |
| Tier 1 git | n/a | n/a | n/a | `.githooks` / `core.hooksPath` runs `guard-bash` on staged `src/**` |

v1 PreToolUse filters to `src/**` (matcher is tool-name; the script reads
stdin JSON for the path). Hop-cap numeric limit is **TBD** — do not invent
a number here.

Grok / ZCode / Hermes / Pi adapters are **later**.

## Stub vs later (historical)

**In the spike PR (done):**

- Spike doc + plugin README labeled SPIKE / not Factory-default
- Skills: `policy-gate` (contract only) and `memory-system` (ledger)
- Host plugin manifests pointing at `./skills`
- `hooks/*.json` pointing at `scripts/`
- Scripts that printed `SPIKE stub` and exited 0
- README / FORK-INDEX **Upcoming / P2 spike** mention only

**v1 (landed; this catalog PR):** real C3.1–C3.3 / C5 / C6 checkers, warn
default, fail via config. See [POLICY-V1.md](POLICY-V1.md).

**Still later:**

- Hop-cap numeric implementation
- Catalog entries, marketplace install commands
- project-factory `enabledPlugins`
- Separate factory-policy git repo / submodule
- Grok/ZCode/Hermes hook adapters
- linear-tracking pin (see [SPIKE-LINEAR-TRACKING.md](SPIKE-LINEAR-TRACKING.md)); GitNexus wrap started (see [SPIKE-GITNEXUS.md](SPIKE-GITNEXUS.md))
- C7 Approved-by git-history check
- Pin bumps of Superpowers / ponytail / Advisor / ODW

## Out of scope

- **No CE** (Compound Engineering). Discarded from Factory. Not a gate.
- **No taskboard / j-space** as defaults or as this plugin's dependencies.
- **No soft-pass.** Stub exit 0 meant "not enforcing," not "checks passed."
  v1 must not revive that.
- **No Factory-default / catalog listing** until explicitly promoted.
- **No `reasoning-system` / `sequentialthinking` reintroduction.**
- **No `enabledPlugins` wiring** in project-factory from this catalog.
- **No Superpowers / ponytail / Advisor / ODW pin bumps.**

## Catalog posture

Host `marketplace.json` files still list exactly the six catalog plugins.
`plugins/factory-policy/` is in-tree so a later PR can point sources at it
without a submodule. Until promotion: document under Upcoming / P2 v1 only.
