# factory-policy

**v1 warn-default — not a Factory default.**

Inline marketplace plugin in [atebites-plugins](https://github.com/atebites-hub/atebites-plugins).
Not a submodule. Catalog-listed for pin install as `factory-policy@atebites-plugins`.
Not a Factory default. Not wired into project-factory `enabledPlugins`. Real
checkers run for C3.1, C3.2, C3.3, C5, and C6. Default
mode is **warn** (stderr `WARN [C3.2] …` + `Fix:`, exit 0). Dial `fail` via
config. C7 is a warn-only stub. Do not treat a skipped hook as a pass.

Current status: [`docs/POLICY-V1.md`](../../docs/POLICY-V1.md).
Historical spike note: [`docs/SPIKE-FACTORY-POLICY.md`](../../docs/SPIKE-FACTORY-POLICY.md).
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

## Named checks

| ID | Name | Default |
| --- | --- | --- |
| C3.1 | doc-cited | warn |
| C3.2 | scope-literal (`inline` \| `open-dynamic-workflows`) | warn |
| C3.3 | plan-filled | warn |
| C5 | gate-runnable | warn |
| C6 | issue-linked | warn |
| C7 | plan-approved (not implemented in v1) | warn stub |

C4 is not in the binding investigation ID list. This plugin does not invent it.

## Config overlay

Shipped defaults: [`config/policy.toml`](config/policy.toml) (all named
checks `warn`).

```bash
# Consumer repo
cp path/to/factory-policy/config/policy.toml config/factory-policy.toml
# edit modes: warn | fail | off

# Or point at any TOML:
export FACTORY_POLICY_CONFIG="$PWD/config/factory-policy.toml"
```

Search order: `--config`, `$FACTORY_POLICY_CONFIG`,
`<repo>/config/factory-policy.toml`, then the shipped file.

## Hooks / scripts

| Script | Event | v1 |
| --- | --- | --- |
| `scripts/policy-gate.sh` | PreToolUse / `preToolUse` | `check-memory <path>` (0/1/2/3); `edit` reads stdin JSON, skips non-`src/**`, require in_progress memory. Warn → 0. Fail-mode → 2 |
| `scripts/stop-verify.sh` | Stop / `stop` | Checkers when `src` changed; hop cap stub (TBD) |
| `scripts/guard-bash.sh` | Tier 1 git | Staged `src/**` → same checkers (git exit 1 on fail); optional regex deny |

JSON pointers: `hooks/claude-codex-hooks.json`, `hooks/cursor-hooks.json`.

Checker: `scripts/check_memory_policy.py` (structured `[C3.2]` / `WARN [C3.2]`
findings). Environment errors fail-open in hooks (one stderr line).
`check-memory` uses the §2.1 contract (missing python → 3).

## Not in this plugin

- CE, taskboard, j-space (discarded from Factory — not defaults)
- Catalog install as a factory-default
- C7 Approved-by git-history enforcement
- F1 / D1 / J1 / S12

## Opt-in (not Factory-default)

Catalog pin: `factory-policy@atebites-plugins` (v1 warn-default; not a Factory
default). Installability only — still not a Factory-wide `enabledPlugins`
default. After a local clone:

```bash
agent --plugin-dir "$PWD/plugins/factory-policy"
bash plugins/factory-policy/scripts/policy-gate.sh check-memory docs/memories/YYYY-MM-DD-slug.md
```

QA fail-mode VERDICT is required before this becomes a Factory default.
