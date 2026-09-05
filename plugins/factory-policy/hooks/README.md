# Hooks (v1 warn-default)

These JSON files point at `scripts/`. Checkers run for C3.1–C3.3, C5, and C6.
Default mode is warn. Fail-mode violations block harness hooks (exit 2).
See [`docs/POLICY-V1.md`](../../../docs/POLICY-V1.md).

| File | Hosts |
| --- | --- |
| `claude-codex-hooks.json` | Claude Code plugin hooks; Codex same event names |
| `cursor-hooks.json` | Cursor `preToolUse` / `stop` (project or plugin copy) |

Tier 1 `guard-bash` is not a harness hook. Consumers can call
`scripts/guard-bash.sh` from `.githooks/pre-commit`.
