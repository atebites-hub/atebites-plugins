# Shared seating checklist (SPIKE placeholders)

**Parked notes. Not production seating. Not a Factory default.**

Codex and ZCode have recipes because they are the current seating pain.
Cursor, Claude, and Antigravity stay **honest placeholders**. Do not fill
these with invented doctor contracts or auto-trust steps.

Normative lock: [`docs/SPIKE-HOST-ADAPTERS.md`](../../../docs/SPIKE-HOST-ADAPTERS.md).
Facts below are copied from Advisor's published host table — not invented.

## Shared questions (every host, later)

When a host leaves "parked", the recipe should answer:

1. Which catalog pin SHA is seated (no floating `main`)?
2. What did install/enable actually write (canonical id vs marketplace twin)?
3. What does `advisor doctor --host <that-host>` report? Fail-closed.
4. Is there a user-gated hook-trust UI? If yes, operator reviews it. No bypass.
5. Optional one-leaf: launch `workflow()` first, then `--run-dir`. No auto-launch.
6. Is ponytail seated at intensity **full** (`PONYTAIL_DEFAULT_MODE=full` /
   `defaultMode: "full"` / `/ponytail full`)? Never lite.

Until those answers exist from live QA, keep the row parked.

## Cursor (parked)

Advisor already has a first-class Cursor IDE / CLI host: `/advisor` and
`doctor --host cursor` (read-only). Strict plugin delegation stays
**disabled**. Prefer Cursor **multitask** when that is the right native
path. ODW alignment with multitask is **required design and unproven**.
Cursor may be the ODW host process (`ODW_HOST=cursor`) without becoming
an accepted Advisor ODW executor.

This pack does **not** add a Cursor seating recipe. Parked until QA.

## Claude (parked)

Prefer **ultracode / Opus plan** when that is the right native path.
Plugin Advisor is guidance only; never overlay Sol-style strict seating.
ODW must align with ultracode (detect / compose / defer); executor stays
rejected until an evidence contract exists. `nativeAdvisor` remains
unverified (Advisor fixture follow-up).

This pack does **not** add a Claude seating recipe. Parked until QA.

## Antigravity (parked)

Advisor: Antigravity is a **deferred gap**. That repository has no
adapter, doctor host, or evidence contract for it. A missing row is not
a soft pass.

This pack does **not** invent an Antigravity recipe. Parked.

## Out of this checklist

- Grok Build / Grok Bot (Advisor: experimental / excluded — not this spike)
- GitHub Copilot (Lane B parked in Project Factory — ignore here)
- CE / taskboard / j-space
- Factory Harness bot (box installs/ops only)
