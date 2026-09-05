# Fork maintenance index

Status of every marketplace submodule and nested fork against [FORK-MAINTENANCE.md](FORK-MAINTENANCE.md).

Verified **2026-09-05** via GitHub API (`parent`, `fork`, `UPSTREAM.md`, compare). D3-A has landed: [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) is a true fork of [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli). [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades onto true-fork `main` (`040993c`); `UPSTREAM.md` and weekday `.github/workflows/sync-upstream.yml` (`workflow_dispatch` + weekday cron) are present. The fork is still **behind kingsword09/main by 7** (diverged) — the sync loop has not caught up. Former orphan HEAD is [atebites-hub/zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) (`227b592`). sol-advisor parent is [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor).

| Product | atebites repo | Upstream | GitHub fork? | UPSTREAM.md | Sync loop | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| zcode-cli | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) | yes | yes | yes (workflow present) | [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged @ `040993c`; factory upgrades on true-fork `main`. Behind kingsword09/main by **7** (diverged); sync loop has not caught up. [zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) kept for history (old ODW pin `a97033fe` lives there). ODW plugin gitlink still stale. |
| ODW core | [atebites-hub/open-dynamic-workflows](https://github.com/atebites-hub/open-dynamic-workflows) | [imsai-sh/open-dynamic-workflows](https://github.com/imsai-sh/open-dynamic-workflows) | yes | missing | missing | Parent linked; needs UPSTREAM + weekly sync |
| ODW plugin | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) | packaging over core + zcode | NO | missing | missing | Marketplace submodule; sync story = core + zcode pins |
| ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | yes | missing | missing | Parent linked |
| sol-advisor | [atebites-hub/sol-advisor](https://github.com/atebites-hub/sol-advisor) | [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor) | yes | missing | missing | Marketplace |
| taskboard | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) | [tcarac/taskboard](https://github.com/tcarac/taskboard) | yes | missing | missing | Parent linked |
| j-space | vendor only | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) | n/a | n/a | n/a | No atebites fork by design |

## Nested pins (ODW plugin)

[atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) `.gitmodules`:

| Path | URL |
| --- | --- |
| `open-dynamic-workflows` | https://github.com/atebites-hub/open-dynamic-workflows.git |
| `zcode-cli` | https://github.com/atebites-hub/zcode-cli.git |

The `zcode-cli` gitlink is pinned to `a97033febe288e2e15ff3e4fd5517aef5a42e369`. That commit is on [atebites-hub/zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) history, **not** on the new true-fork `atebites-hub/zcode-cli` `main`. Recursive `git submodule update --init` against the true-fork remote fails at that ref. Retarget onto true-fork `main` (`040993c`) is in progress on [open-dynamic-workflows-plugin PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13). Do not retarget the pin from this catalog.

## Marketplace `.gitmodules`

This repo (`atebites-plugins`):

| Path | URL |
| --- | --- |
| `plugins/open-dynamic-workflows` | https://github.com/atebites-hub/open-dynamic-workflows-plugin.git |
| `plugins/ponytail` | https://github.com/atebites-hub/ponytail.git |
| `plugins/sol-advisor` | https://github.com/atebites-hub/sol-advisor.git |
| `plugins/taskboard/upstream` | https://github.com/atebites-hub/taskboard.git |
| `plugins/j-space/vendor/j-space-cognition-suite` | https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6.git |

Pin bumps here only after fork CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix). This index does not change SHAs.

## P1 next

1. **Run/complete first `chore: sync upstream`** for the behind-7 debt on zcode-cli and confirm `UPSTREAM_SYNC_TOKEN`. [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) is open (`chore/sync-upstream-83c924d`, conflicts in runtime tests); Actions `GITHUB_TOKEN` could not open it unattended. Do not treat the sync loop as caught up until `main` contains kingsword09/main.
2. **ODW plugin gitlink retarget + smoke.** Pin still `a97033fe` (legacy-only). Retarget in progress on [open-dynamic-workflows-plugin PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13). Do not bump pins from this catalog.
3. **Fleet `UPSTREAM.md` + weekly sync** on the other GitHub-linked forks (ODW core, ponytail, sol-advisor, taskboard). Still missing.
4. **Marketplace pin bumps only after smoke.** Nested ODW `zcode-cli` pin stays `a97033fe` until retarget + smoke land. Record `not run — harness absent` instead of fake green.

No factory-policy/gitnexus in this catalog yet.
