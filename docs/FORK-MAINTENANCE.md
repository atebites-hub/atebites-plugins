# Fork maintenance

atebites-hub forks of marketplace products follow this binding policy. Owners: **Jaskarn** and the **Factory Plugins** bot.

Status of every catalog submodule and nested pin: [FORK-INDEX.md](FORK-INDEX.md).

## Policy

- **GitHub fork parent** when possible. `origin` is atebites-hub; `upstream` is the canonical repo.
- Each fork ships **`UPSTREAM.md`**: upstream URL, base SHA, divergence list, and sync instructions.
- **Weekly weekday sync.** If upstream moved, open a PR titled `chore: sync upstream`.
- **Security sync within 24h** of a known upstream security fix.
- **Marketplace pin bumps** in this catalog only after the fork's CI is green and host smoke (below) passes.

## Smoke matrix

Record each cell as pass/fail, or `not run — harness absent`. Do not mark green without a real run.

| Host | What to run |
| --- | --- |
| ZCode CLI | `--prompt` hello (plus JSON/attestation if the product supports them) |
| ODW | one-leaf workflow on `zcode` and one other executor |
| Cursor / Grok / Claude / Codex | install from this marketplace, or `--plugin-dir` when the product ships that path |

This catalog does not run those harnesses in CI. Gaps stay `not run — harness absent`.
