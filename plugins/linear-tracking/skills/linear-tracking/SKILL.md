---
name: linear-tracking
description: >
  Factory Linear tracker placement (replaces taskboard-workflow): at
  session start find the Linear issue; put Closes BLA-n in the PR body;
  do not auto-delegate every issue to Cursor. Use when starting a
  session that has a Linear issue and when opening a PR.
---

# linear-tracking (SPIKE stub)

**Upcoming / not a Factory default. Not catalog-listed.** This skill is
placement rules only. It is not a Linear API client and it does not
install Linear Agent skills.

SoT: PJTemplate investigation `linear-driven-flow.md` §3 (cited by
name; not on PJTemplate `main` as of 2026-09-05) plus the Jay lock:
keep `linear-tracking`; prefer a vendored upstream pin, not necessarily
atebites-authored.

Transport: official Linear MCP at `https://mcp.linear.app/mcp` (OAuth).
Cite tool **names** only. Do not bake schemas. Do not invent API
secrets.

factory-policy C6 (memory `- **Linear**: KEY-123`) is a separate plugin.
This skill finds the issue and closes it from the PR.

## Placement

1. **Session start — find the issue.** Call `list_issues`,
   `list_my_issues`, and/or `get_issue`. Do not invent an id. If MCP is
   missing or unauthenticated, stop and say so (fail closed; not a
   pass).
2. **PR body — `Closes BLA-n`.** Put that closing magic word plus the
   Linear id in the **PR body** (a later comment does not link). `BLA-n`
   is the investigation example; use the workspace team key in real
   work (`Closes ENG-123`).
3. **No auto-delegate to Cursor on every issue.** Do not assign every
   issue to Linear Agent / `@Cursor` / a triage rule that launches a
   Cloud Agent. Delegation is operator-gated.

## Not this skill

- Linear Agent as a shipped Factory skill
- taskboard / `taskboard-workflow` / CE / j-space
- Catalog or Factory-default promotion
- Soft-pass when MCP is down
