# factory-policy v1 (warn-default)

**Status:** v1 warn-default enforcement. **Not** a Factory default. **Not**
listed in host catalogs. **Not** wired into project-factory `enabledPlugins`.

Assistant seats the template; QA verifies before anyone dials fail or promotes
this plugin to a catalog / Factory default.

SoT: `factory-01-policy-layer.md`, `policy-gate.md`, Build Sheet §5
(PJTemplate handoff). Do not invent **C4**. C7 is a warn-only stub
(plan-approved / Approved-by git history is not implemented in v1).

The spike scaffold is superseded: [SPIKE-FACTORY-POLICY.md](SPIKE-FACTORY-POLICY.md).

## What shipped

`plugins/factory-policy/` now runs real checkers instead of printing
`SPIKE stub` and exiting 0. A warn-only finding still exits 0, but it prints
`WARN [C3.2] …` plus `Fix:` on stderr. That is not a silent pass. Fail-mode
violations exit 1 from the checker / `check-memory`, and exit 2 from harness
hooks (`edit`, `stop-verify`) so the host can block.

`memory-system` stays nested. The consumer ledger path remains `docs/memories/`.

CE / taskboard / j-space stay discarded from Factory.

## Named checks

| ID | Name | Pass when |
| --- | --- | --- |
| **C3.1** | doc-cited | `Context` contains ≥1 path matching `docs/agents/[a-z_]+\.md` that exists on disk (consumer cwd / `--repo-root`) |
| **C3.2** | scope-literal | `Scope` is exactly `inline` or `open-dynamic-workflows` |
| **C3.3** | plan-filled | `Plan` is non-placeholder (not empty / `TODO` / `[Ordered…]`) |
| **C5** | gate-runnable | For verifiable tasks: `Gate: <command>` present; first token resolves via `command -v` **or** is an existing repo-relative file. `non-verifiable` skips the gate |
| **C6** | issue-linked | Memory cites a tracker issue: URL, `#N`, `Closes #N`, or `- **Linear**: KEY-123` |
| **C7** | plan-approved | **Not implemented in v1.** Config `fail` is ignored and warned. |

## Config dial

Shipped file: [`plugins/factory-policy/config/policy.toml`](../plugins/factory-policy/config/policy.toml).

Default every named check to `warn`. Modes: `warn` | `fail` | `off`.

Consumer overlay (later file wins for listed keys):

1. Copy the shipped file to `<repo>/config/factory-policy.toml`
2. Change selected checks to `fail` (or `off`)
3. Or set `FACTORY_POLICY_CONFIG=/absolute/path/to.toml`
4. CLI: `check_memory_policy.py --config PATH`

## Checker exit contract (policy-gate.md §2.1)

`scripts/check_memory_policy.py` and `policy-gate.sh check-memory <path>`:

| Code | Meaning |
| --- | --- |
| 0 | pass, or warn-only findings |
| 1 | fail-mode violation (`Fix:` on stderr) |
| 2 | usage |
| 3 | environment (unreadable config, missing python for `check-memory`) |

Harness `edit` / `stop-verify`: fail-mode violation → **exit 2** (hook block).
Environment errors **fail-open** (one stderr line, exit 0). Never soft-pass a
policy violation.

## Scripts

| Script | Role |
| --- | --- |
| `scripts/check_memory_policy.py` | Field checkers + `extract-path` / `gate-in-progress` |
| `scripts/policy-gate.sh` | `check-memory <path>` and `edit` (stdin JSON → path; non-`src/**` skipped) |
| `scripts/stop-verify.sh` | Recheck in_progress memories when `src` changed; hop cap stub (TBD) |
| `scripts/guard-bash.sh` | Tier 1: staged `src/**` → same checkers; optional regex deny |

Skip messages say `skipped (not a pass)`. Scripts do not print `SPIKE stub`.

## Out of scope (still)

- Host catalog listing / Factory default / project-factory `enabledPlugins`
- C7 full Approved-by git-history forge-check
- F1 / D1 / J1 / S12
- Inventing C4

## No CE

CE, taskboard, and j-space are not Factory defaults and are not part of this
plugin.
