# Fork maintenance index

Status of every marketplace submodule and nested fork against [FORK-MAINTENANCE.md](FORK-MAINTENANCE.md).

Verified **2026-09-05** via GitHub API (`parent`, `fork`, `UPSTREAM.md`, compare). D3-A has landed: [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) is a true fork of [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli). [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades onto true-fork `main` (`040993c`). [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged the first `chore: sync upstream`. `main` tip is `cfd0de2` (after [PR #3](https://github.com/atebites-hub/zcode-cli/pull/3) CI hygiene) and the fork is **behind kingsword09/main by 0**. `UPSTREAM.md` and weekday `.github/workflows/sync-upstream.yml` (`workflow_dispatch` + weekday cron) are present. `UPSTREAM_SYNC_TOKEN` is set as a repo secret on all six (zcode-cli, open-dynamic-workflows, open-dynamic-workflows-plugin, ponytail, sol-advisor, taskboard). Unattended `createPullRequest` is validated: Actions opened [open-dynamic-workflows-plugin #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) (`chore: sync nested pins`) after the wider token was re-set (~19:04Z). Prior failure mode, before the wider token: ponytail could push the sync branch but the PR had to be opened manually ([#4](https://github.com/atebites-hub/ponytail/pull/4), now merged). True forks are **behind_by 0**; ponytail `workflow_dispatch` exits with "nothing to sync". Hold merging [#15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) until Factory QA smoke (nested pin bump). Fleet forks now have the same UPSTREAM + weekday sync artifacts: [open-dynamic-workflows #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9), [ponytail #2](https://github.com/atebites-hub/ponytail/pull/2), [taskboard #1](https://github.com/atebites-hub/taskboard/pull/1), [sol-advisor #7](https://github.com/atebites-hub/sol-advisor/pull/7). ODW plugin [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md`, nested `.github/workflows/sync-nested-pins.yml`, and retargeted the `zcode-cli` gitlink to `040993c` (still the pin on `main`; current tip `cfd0de2` is ahead). Former orphan HEAD is [atebites-hub/zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) (`227b592`). sol-advisor parent is [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor).

| Product | atebites repo | Upstream | GitHub fork? | UPSTREAM.md | Sync loop | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| zcode-cli | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) | yes | yes | yes (workflow present) | [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades @ `040993c`. [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged first `chore: sync upstream`; `main` tip `cfd0de2` after [PR #3](https://github.com/atebites-hub/zcode-cli/pull/3); behind kingsword09/main by **0**. `UPSTREAM_SYNC_TOKEN` is set / unattended sync validated (workflow_dispatch success after sync #2). [zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) kept for history (old ODW pin `a97033fe` lives there). ODW plugin gitlink on `main` still `040993c`. |
| ODW core | [atebites-hub/open-dynamic-workflows](https://github.com/atebites-hub/open-dynamic-workflows) | [imsai-sh/open-dynamic-workflows](https://github.com/imsai-sh/open-dynamic-workflows) | yes | yes | yes (workflow present) | Parent linked. [PR #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| ODW plugin | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) | packaging over core + zcode | NO | yes | yes (nested workflow present) | Marketplace packaging (`fork: false`). [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md` + weekday `.github/workflows/sync-nested-pins.yml`. Nested `zcode-cli` pin on `main` still `040993c` (tip `cfd0de2`). [PR #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) open (`chore: sync nested pins`); hold for Factory QA smoke. |
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

The `zcode-cli` gitlink is pinned to `040993c2990dbf00d0cc6ff8044d510e065adcbe` on [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) `main` ([open-dynamic-workflows-plugin PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged). Current zcode-cli `main` tip is `cfd0de2` (after [zcode-cli PR #3](https://github.com/atebites-hub/zcode-cli/pull/3)); this catalog does not bump the pin. [PR #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) would move it to `cfd0de2` — hold until Factory QA smoke. Recursive `git submodule update --init` against the true-fork remote succeeds at `040993c`.

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

1. **Factory QA smoke / playtest on [ODW-plugin #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15)** before merging that nested pin bump. Sync-token / unattended `createPullRequest` is done (Actions opened #15). Marketplace pins still only after smoke.
2. **Marketplace pin bumps only after QA playtest / smoke.** Nested ODW `zcode-cli` pin on `main` is still `040993c` (true-fork). Do not bump marketplace SHAs from this catalog. Record `not run — harness absent` instead of fake green.
3. **Optional remaining sync dry-runs** (`workflow_dispatch` on each `sync-upstream.yml`). ODW-plugin `sync-nested-pins.yml` already opened #15; ponytail dispatch exits with "nothing to sync".

No factory-policy/gitnexus in this catalog yet.
