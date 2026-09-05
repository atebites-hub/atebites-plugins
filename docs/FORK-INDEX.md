# Fork maintenance index

Status of every marketplace submodule and nested fork against [FORK-MAINTENANCE.md](FORK-MAINTENANCE.md).

Verified **2026-09-05** via GitHub API (`parent`, `fork`, `UPSTREAM.md`, compare). D3-A has landed: [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) is a true fork of [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli). [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades onto true-fork `main` (`040993c`). [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged the first `chore: sync upstream`; `main` tip is `73a742a` and the fork is **behind kingsword09/main by 0**. `UPSTREAM.md` and weekday `.github/workflows/sync-upstream.yml` (`workflow_dispatch` + weekday cron) are present. `UPSTREAM_SYNC_TOKEN` is still required for unattended `gh pr create` (Actions `GITHUB_TOKEN` could not open PR #2). Fleet forks now have the same UPSTREAM + weekday sync artifacts: [open-dynamic-workflows #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9), [ponytail #2](https://github.com/atebites-hub/ponytail/pull/2), [taskboard #1](https://github.com/atebites-hub/taskboard/pull/1), [sol-advisor #7](https://github.com/atebites-hub/sol-advisor/pull/7). ODW plugin [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md`, nested `.github/workflows/sync-nested-pins.yml`, and retargeted the `zcode-cli` gitlink to `040993c` (on true-fork `main`; current tip `73a742a` is ahead). Former orphan HEAD is [atebites-hub/zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) (`227b592`). sol-advisor parent is [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor).

| Product | atebites repo | Upstream | GitHub fork? | UPSTREAM.md | Sync loop | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| zcode-cli | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) | yes | yes | yes (workflow present) | [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades @ `040993c`. [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged first `chore: sync upstream`; `main` tip `73a742a`; behind kingsword09/main by **0**. `UPSTREAM_SYNC_TOKEN` is set / unattended sync validated (workflow_dispatch success after sync #2). [zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) kept for history (old ODW pin `a97033fe` lives there). ODW plugin gitlink retargeted to `040993c`. |
| ODW core | [atebites-hub/open-dynamic-workflows](https://github.com/atebites-hub/open-dynamic-workflows) | [imsai-sh/open-dynamic-workflows](https://github.com/imsai-sh/open-dynamic-workflows) | yes | yes | yes (workflow present) | Parent linked. [PR #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| ODW plugin | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) | packaging over core + zcode | NO | yes | yes (nested workflow present) | Marketplace packaging (`fork: false`). [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md` + weekday `.github/workflows/sync-nested-pins.yml`. Nested `zcode-cli` pin `040993c` (on true-fork `main`; tip is `73a742a`). |
| ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | yes | yes | yes (workflow present) | Parent linked. [PR #2](https://github.com/atebites-hub/ponytail/pull/2) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| sol-advisor | [atebites-hub/sol-advisor](https://github.com/atebites-hub/sol-advisor) | [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor) | yes | yes | yes (workflow present) | Marketplace. [PR #7](https://github.com/atebites-hub/sol-advisor/pull/7) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| taskboard | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) | [tcarac/taskboard](https://github.com/tcarac/taskboard) | yes | yes | yes (workflow present) | Parent linked. [PR #1](https://github.com/atebites-hub/taskboard/pull/1) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| j-space | vendor only | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) | n/a | n/a | n/a | No atebites fork by design |

## Nested pins (ODW plugin)

[atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) `.gitmodules`:

| Path | URL |
| --- | --- |
| `open-dynamic-workflows` | https://github.com/atebites-hub/open-dynamic-workflows.git |
| `zcode-cli` | https://github.com/atebites-hub/zcode-cli.git |

The `zcode-cli` gitlink is pinned to `040993c2990dbf00d0cc6ff8044d510e065adcbe` on [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) `main` ([open-dynamic-workflows-plugin PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged). Current zcode-cli `main` tip is `73a742a` after [zcode-cli PR #2](https://github.com/atebites-hub/zcode-cli/pull/2); sync #2 did not move this plugin pin. Recursive `git submodule update --init` against the true-fork remote succeeds at `040993c`. Do not bump the pin from this catalog.

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

1. **Confirm `UPSTREAM_SYNC_TOKEN`** on the GitHub-linked forks (and the ODW plugin) so weekday sync can open PRs unattended. [zcode-cli PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) had to be opened via `gh` after Actions `GITHUB_TOKEN` failed `gh pr create`.
2. **Marketplace pin bumps only after QA playtest / smoke.** Nested ODW `zcode-cli` pin is `040993c` (true-fork, on `main`). Do not bump marketplace SHAs from this catalog. Record `not run — harness absent` instead of fake green.
3. **Optional first sync dry-runs** (`workflow_dispatch` on each new `sync-upstream.yml` / `sync-nested-pins.yml`) to confirm the loop opens `chore: sync upstream` / `chore: sync nested pins` when remotes moved.

No factory-policy/gitnexus in this catalog yet.
