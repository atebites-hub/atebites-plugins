# factory-policy

**SPIKE — not a Factory default until v1.**

Inline marketplace plugin stub in [atebites-plugins](https://github.com/atebites-hub/atebites-plugins).
Not a submodule. Not listed in host catalogs. Not wired into project-factory
`enabledPlugins`. Scripts exit 0 and print `SPIKE stub`; they do **not**
enforce C3–C7. Do not treat stub success as a pass (no soft-pass).

Normative spike scope: [`docs/SPIKE-FACTORY-POLICY.md`](../../docs/SPIKE-FACTORY-POLICY.md).
C3–C7 SoT: `factory-01-policy-layer.md`, `policy-gate.md`, Build Sheet §5
(PJTemplate handoff).

## What this is

P2 upgraded **reasoning-system**. factory-policy enforces the task-memory
ledger. `memory-system` stays **inside** this plugin (keep the name). The
ledger path in a consumer repo is still `docs/memories/`.

Native models reason. The `policy-gate` skill is the **memory field contract**
only — it does not call `sequentialthinking`.

## Skills

| Skill | Role |
| --- | --- |
| `policy-gate` | Field contract + how to satisfy C3.1, C3.2, C3.3, C5, C6, C7 |
| `memory-system` | Read/write `docs/memories/` from the template |

## Named checks (not enforced in this spike)

| ID | Name |
| --- | --- |
| C3.1 | doc-cited |
| C3.2 | scope-literal (`inline` \| `open-dynamic-workflows`) |
| C3.3 | plan-filled |
| C5 | gate-runnable |
| C6 | issue-linked |
| C7 | plan-approved |

C4 is not in the binding investigation ID list. This stub does not invent it.

## Hooks (placeholders)

| Script | Intended event | Today |
| --- | --- | --- |
| `scripts/policy-gate.sh` | PreToolUse / `preToolUse` on `src/**` edits | SPIKE stub, exit 0 |
| `scripts/stop-verify.sh` | Stop / `stop` verify with hop cap | SPIKE stub, exit 0 |
| `scripts/guard-bash.sh` | Tier 1 git `guard-bash` | SPIKE stub, exit 0 |

JSON pointers: `hooks/claude-codex-hooks.json`, `hooks/cursor-hooks.json`.

## Not in this plugin

- CE, taskboard, j-space (discarded from Factory — not defaults)
- Catalog install as a factory-default
- Production enforcement

## Opt-in (spike only)

Hosts do not install this from the marketplace. After a local clone:

```bash
# Cursor CLI / similar — SPIKE, not Factory-default
agent --plugin-dir "$PWD/plugins/factory-policy"
```

v1 is required before this becomes a catalog plugin or a Factory default.
