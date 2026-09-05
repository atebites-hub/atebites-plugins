---
name: policy-gate
description: >
  Factory-policy memory field contract (C3.1 doc-cited, C3.2 scope-literal,
  C3.3 plan-filled, C5 gate-runnable, C6 issue-linked, C7 plan-approved).
  Use when planning, before editing src/**, and when closing a task.
  Native models reason; this skill does not call sequentialthinking.
---

# policy-gate (SPIKE — contract only)

**SPIKE.** This skill is normative **field contract** plus how to satisfy each
named check. It is not a reasoning procedure. Native models reason. Do not
invoke `sequentialthinking` or `reasoning-system`.

Hooks in this plugin are stubs. They do **not** enforce these checks. Do not
claim a stub exit 0 as a pass.

Ledger how-to: the nested `memory-system` skill. Template:
[`../memory-system/assets/memory_template.md`](../memory-system/assets/memory_template.md).
Consumer path: `docs/memories/`.

## Field contract

| Check | Name | Memory / repo field | Literal requirement |
| --- | --- | --- | --- |
| **C3.1** | doc-cited | `- **Context**:` under `## Task (TCREI)` | Cite the cores the consumer's document-mapping assigns to this task type (plus relevant code paths). Not a lone `[...]` placeholder. |
| **C3.2** | scope-literal | `- **Scope**:` under `## Task (TCREI)` | Exactly `inline` or `open-dynamic-workflows`. |
| **C3.3** | plan-filled | `- **Plan**:` under `## Task (TCREI)` | Ordered implementation steps. Not a placeholder. |
| **C5** | gate-runnable | `- **Evaluation**:` under `## Task (TCREI)` | One `Gate: <command>` the machine can run (exit 0/1). Prose-only acceptance is not C5. |
| **C6** | issue-linked | The same memory file | A tracker citation: issue URL, `#N`, or `Closes #N`. |
| **C7** | plan-approved | Consumer `docs/plans/` + memory pointer | The task is tied to a **human-approved** plan. Agents do not approve. |

**C4** is not in the binding investigation ID list. Do not invent a C4 field.

## How to satisfy each check

### C3.1 doc-cited

Open the consumer mapping (`docs/agents/document-mapping.md` or the
reasoning-era `document-mapping` the project still ships). Write `Context`
as the docs you actually used, not a generic "see docs/agents."

### C3.2 scope-literal

Set `Scope` during planning. Default `inline`. Use `open-dynamic-workflows`
only when the work needs a rerunnable multi-agent script. Do not write
"ODW", "inline work", or other synonyms — the checker will be literal.

### C3.3 plan-filled

Put the ordered steps in `Plan` (files to touch, sequence). Empty or
template-bracket text fails C3.3.

### C5 gate-runnable

In `Evaluation`, name exactly one acceptance gate as `Gate: <command>`.
The command must be runnable in the consumer repo. A rubric-only gate is
not C5 (`gate-runnable`). Classify `verifiable` when a command can decide
done.

### C6 issue-linked

Cite the tracker issue in the memory (Description, an `Issue:` line, or
`Closes #N`). No issue citation fails C6.

### C7 plan-approved

Point at `docs/plans/<epic>.md` (or the consumer's plan path) that a human
already approved. If the plan is missing, unsigned, or agent-signed only,
stop for the human. Do not self-approve.

## When this applies

Before editing `src/**` (v1: PreToolUse policy gate). At turn end (v1:
Stop verify with hop cap). At commit (v1: Tier 1 `guard-bash`).

Throwaway spikes that never land durable `src/**` do not need the ceremony.
Promote findings into a real memory before durable code lands.

## Out of contract

CE, taskboard, and j-space are not Factory defaults and are not required
to satisfy these checks.
