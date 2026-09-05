---
name: memory-system
description: Read and write task memories in docs/memories/. Use when planning, starting work, after searches or user feedback, and when completing tasks.
---

# Memory System

**Nested in factory-policy.** This skill is the ledger. It does not enforce
C3.x–C7. Enforcement belongs to `policy-gate` (v1 hooks / `guard-bash`).
This copy is a SPIKE skill inside a non-default plugin.

Project task memories live in **`docs/memories/`** as Markdown files. This is
separate from any host-level memory. Follow this skill when the consumer repo
requires task memory.

Do not delete this skill when factory-policy replaces `reasoning-system`.

## When to use

- **Before a task**: Create or open the task’s memory file; fill it from the
  template; set status to `in_progress`.
- **During work**: After searches or user input, update the same file.
- **After a task**: Update status, timestamps, lessons; keep ledger fields
  truthful.

## Recall (scan then read)

Survey all memories cheaply (everything through **Related Memories**, before
**Task (TCREI)** or **Status**):

```bash
for f in docs/memories/*.md; do
  echo "=== $f ==="
  awk '/^## Task \(TCREI\)|^## Status/{exit} {print}' "$f"
  echo
done
```

Pick the most relevant paths from context (current task, **Related Memories**).
**Read the full file** only for those.

## Write

1. **Naming**: `YYYY-MM-DD-<short-task-slug>.md` (kebab-case slug).
2. **Template**: Copy [assets/memory_template.md](assets/memory_template.md).
   Task structure and fields are defined there.
3. **Before starting**: New file from template; complete **Description**,
   **Related Memories**, **Task (TCREI)** including **Scope** (`inline` or
   `open-dynamic-workflows`), **Status** (`in_progress`, timestamps).
4. **After finishing**: Same file; set **Status** (`completed` / `cancelled`),
   **Lessons** / **Learnings**, final timestamps.

Satisfy factory-policy checks with the same file — see the sibling
`policy-gate` skill (C3.1 doc-cited, C3.2 scope-literal, C3.3 plan-filled,
C5 gate-runnable, C6 issue-linked, C7 plan-approved). Native models reason
into these fields. This skill does not call `sequentialthinking`.

## Requirements

- Prefer links to code/docs over long pasted content.
- Keep one memory per task. Do not invent a parallel ledger.
