---
name: policy-gate
description: >
  Factory-policy memory field contract (C3.1 doc-cited, C3.2 scope-literal,
  C3.3 plan-filled, C5 gate-runnable, C6 issue-linked, C7 plan-approved).
  Use when planning, before editing src/**, and when closing a task.
  Native models reason; this skill does not call sequentialthinking.
---

# policy-gate (v1 warn-default)

This skill is the normative **field contract** plus how to satisfy each named
check. It is not a reasoning procedure. Native models reason. Do not
invoke `sequentialthinking` or `reasoning-system`.

C3–C7 SoT is exactly `factory-01-policy-layer.md`, `policy-gate.md`, and
Build Sheet §5 (PJTemplate handoff). Do not invent a C4 field.

v1 ships real checkers (`scripts/check_memory_policy.py`) with a **warn**
default. Dial `fail` or `off` per check in `config/policy.toml` or a consumer
overlay (`config/factory-policy.toml` or `$FACTORY_POLICY_CONFIG`). Warn
prints `WARN [C3.2] …` and `Fix:` on stderr, exit 0. Fail-mode prints
`[C3.2] …` + `Fix:` and exits 1 from `check-memory` (hook `edit` / Stop
map that to exit 2). C7 is not implemented in v1 (warn stub only).

This plugin is **not** a Factory default. It is catalog-listed for pin install
only (`factory-policy@atebites-plugins`).

Ledger how-to: the nested `memory-system` skill. Template:
[`../memory-system/assets/memory_template.md`](../memory-system/assets/memory_template.md).
Consumer path: `docs/memories/`.

## Field contract

| Check | Name | Memory / repo field | Literal requirement |
| --- | --- | --- | --- |
| **C3.1** | doc-cited | `- **Context**:` under `## Task (TCREI)` | ≥1 path matching `docs/agents/[a-z_]+\.md` that exists on disk in the consumer repo |
| **C3.2** | scope-literal | `- **Scope**:` under `## Task (TCREI)` | Exactly `inline` or `open-dynamic-workflows`. |
| **C3.3** | plan-filled | `- **Plan**:` under `## Task (TCREI)` | Ordered implementation steps. Not empty, `TODO`, or `[Ordered…]`. |
| **C5** | gate-runnable | `- **Evaluation**:` under `## Task (TCREI)` | For verifiable tasks: `Gate: <command>` whose first token is on `PATH` or a repo-relative file. `non-verifiable` skips the gate. |
| **C6** | issue-linked | The same memory file | A tracker citation: issue URL, `#N`, `Closes #N`, or `- **Linear**: KEY-123`. |
| **C7** | plan-approved | Consumer `docs/plans/` + memory pointer | Human-approved plan. **Not implemented in v1.** Agents do not approve. |

C4 is not in the binding investigation ID list. Do not invent a C4 field.

## How to satisfy each check

### C3.1 doc-cited

Open the consumer mapping (`docs/agents/document-mapping.md` or the
reasoning-era `document-mapping` the project still ships). Write `Context`
with at least one real `docs/agents/<lowercase_name>.md` path that exists
on disk.

### C3.2 scope-literal

Set `Scope` during planning. Default `inline`. Use `open-dynamic-workflows`
only when the work needs a rerunnable multi-agent script. Do not write
"ODW", "inline work", or other synonyms — the checker is literal.

### C3.3 plan-filled

Put the ordered steps in `Plan` (files to touch, sequence). Empty,
`TODO`, or template-bracket `[Ordered…]` text fails C3.3.

### C5 gate-runnable

In `Evaluation`, name exactly one acceptance gate as `Gate: <command>`
when the task is verifiable. The first token must resolve (`command -v`)
or be an existing repo-relative file. Classify `non-verifiable` when no
command can decide done — then C5 does not require a gate.

### C6 issue-linked

Cite the tracker issue in the memory (Description, an `Issue:` line,
`#N`, `Closes #N`, a URL, or `- **Linear**: KEY-123`). No citation
fails C6.

### C7 plan-approved

Point at `docs/plans/<epic>.md` (or the consumer's plan path) that a human
already approved. v1 does not forge-check `Approved-by` git history. If
the plan is missing or unsigned, stop for the human. Do not self-approve.

## When this applies

Before editing `src/**` (`policy-gate.sh edit` / PreToolUse). At turn end
(`stop-verify.sh`; hop cap TBD). At commit (`guard-bash.sh` on staged
`src/**`).

Throwaway spikes that never land durable `src/**` do not need the ceremony.
Promote findings into a real memory before durable code lands.

## Out of contract

CE, taskboard, and j-space are not Factory defaults and are not required
to satisfy these checks.
