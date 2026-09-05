# Hooks (SPIKE placeholders)

These JSON files point at `scripts/`. Every script prints `SPIKE stub` and
exits 0. They do **not** enforce C3–C7. v1 will implement the matrix in
[`docs/SPIKE-FACTORY-POLICY.md`](../../../docs/SPIKE-FACTORY-POLICY.md).

| File | Hosts |
| --- | --- |
| `claude-codex-hooks.json` | Claude Code plugin hooks; Codex same event names |
| `cursor-hooks.json` | Cursor `preToolUse` / `stop` (project or plugin copy) |

Tier 1 `guard-bash` is not a harness hook. Consumers will call
`scripts/guard-bash.sh` from `.githooks/pre-commit` in v1.
