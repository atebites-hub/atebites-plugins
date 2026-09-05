# Fork maintenance index

Status of every marketplace submodule and nested fork against [FORK-MAINTENANCE.md](FORK-MAINTENANCE.md).

Verified **2026-09-05** via GitHub API (`parent`, `fork`, `UPSTREAM.md`, compare). D3-A has landed: [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) is a true fork of [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli). [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades onto true-fork `main` (`040993c`). [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged the first `chore: sync upstream`. `main` tip is `cfd0de2` (after [PR #3](https://github.com/atebites-hub/zcode-cli/pull/3) CI hygiene) and the fork is **behind kingsword09/main by 0**. `UPSTREAM.md` and weekday `.github/workflows/sync-upstream.yml` (`workflow_dispatch` + weekday cron) are present. `UPSTREAM_SYNC_TOKEN` is set as a repo secret on all six (zcode-cli, open-dynamic-workflows, open-dynamic-workflows-plugin, ponytail, advisor, taskboard). Unattended `createPullRequest` is validated: Actions opened [open-dynamic-workflows-plugin #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) (`chore: sync nested pins`) after the wider token was re-set (~19:04Z); #15 merged ~19:11Z (`4cfd771`). Prior failure mode, before the wider token: ponytail could push the sync branch but the PR had to be opened manually ([#4](https://github.com/atebites-hub/ponytail/pull/4), now merged). True forks are **behind_by 0**; ponytail `workflow_dispatch` exits with "nothing to sync". Fleet forks now have the same UPSTREAM + weekday sync artifacts: [open-dynamic-workflows #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9), [ponytail #2](https://github.com/atebites-hub/ponytail/pull/2), [taskboard #1](https://github.com/atebites-hub/taskboard/pull/1), [advisor #7](https://github.com/atebites-hub/advisor/pull/7). ODW plugin [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md`, nested `.github/workflows/sync-nested-pins.yml`, and retargeted the `zcode-cli` gitlink to `040993c`. [PR #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) then moved nested pins on `main` to zcode-cli `cfd0de2` / ODW core `2c9a919`. Factory QA Lane A APPROVE; live smoke still **not run — Lane B awaiting Jay credentials**. Former orphan HEAD is [atebites-hub/zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) (`227b592`). Advisor (`atebites-hub/advisor`, renamed from `atebites-hub/sol-advisor`) parent is [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor).

| Product | atebites repo | Upstream | GitHub fork? | UPSTREAM.md | Sync loop | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| zcode-cli | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) | yes | yes | yes (workflow present) | [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades @ `040993c`. [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged first `chore: sync upstream`; `main` tip `cfd0de2` after [PR #3](https://github.com/atebites-hub/zcode-cli/pull/3); behind kingsword09/main by **0**. `UPSTREAM_SYNC_TOKEN` is set / unattended sync validated (workflow_dispatch success after sync #2). [zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) kept for history (old ODW pin `a97033fe` lives there). ODW plugin gitlink on `main` is `cfd0de2` after [plugin #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15). |
| ODW core | [atebites-hub/open-dynamic-workflows](https://github.com/atebites-hub/open-dynamic-workflows) | [imsai-sh/open-dynamic-workflows](https://github.com/imsai-sh/open-dynamic-workflows) | yes | yes | yes (workflow present) | Parent linked. [PR #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| ODW plugin | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) | packaging over core + zcode | NO | yes | yes (nested workflow present) | Marketplace packaging (`fork: false`). [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md` + weekday `.github/workflows/sync-nested-pins.yml`. Nested pins on `main` after [PR #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) (`4cfd771`): `zcode-cli` `cfd0de2`, ODW core `2c9a919`. Live smoke **not run — Lane B awaiting Jay credentials**. |
| ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | yes | yes | yes (workflow present) | Parent linked. **Factory-required** default candidate (Jay). Marketplace pin `911022dc1fb868b42e006c1848aaf16b0867de2f`. Fork `main` tip `908e5c4d5c324cb8eceddf64814c2b19a6334b88` — pin ≠ tip; bump only after CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix). [PR #2](https://github.com/atebites-hub/ponytail/pull/2) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| Advisor | [atebites-hub/advisor](https://github.com/atebites-hub/advisor) | [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor) | yes | yes | yes (workflow present) | Marketplace. GitHub rename `atebites-hub/sol-advisor` → `atebites-hub/advisor` (parent unchanged; old URL redirects). Catalog slug and checkout path are `advisor` / `plugins/advisor`. Upgrade: install `advisor` from this marketplace (was `sol-advisor`). Productize scrub landed ([PR #9](https://github.com/atebites-hub/advisor/pull/9)); Factory QA Lane A PASS. ODW native-alignment docs landed ([PR #10](https://github.com/atebites-hub/advisor/pull/10)); alignment still unproven until live QA. Pin matches `main` tip `6d2b562ec7b29d98792d83999eea3760a1365056`. Inner package path and coordinate remain `plugins/sol-advisor` / `sol-advisor@sol-advisor`. Claude `nativeAdvisor` still unverified — fixture follow-up. [PR #7](https://github.com/atebites-hub/advisor/pull/7) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| taskboard | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) | [tcarac/taskboard](https://github.com/tcarac/taskboard) | yes | yes | yes (workflow present) | Parent linked. [PR #1](https://github.com/atebites-hub/taskboard/pull/1) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| j-space | vendor only | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) | n/a | n/a | n/a | No atebites fork by design |
| Superpowers | pin only (not an atebites fork) | [obra/superpowers](https://github.com/obra/superpowers) | n/a | n/a | n/a | Factory-default pin. [obra/superpowers](https://github.com/obra/superpowers) @ **v6.3.0** / `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`. Assistant will wire project-factory `enabledPlugins` for Superpowers and ponytail (Factory-required). |

## Nested pins (ODW plugin)

[atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) `.gitmodules`:

| Path | URL |
| --- | --- |
| `open-dynamic-workflows` | https://github.com/atebites-hub/open-dynamic-workflows.git |
| `zcode-cli` | https://github.com/atebites-hub/zcode-cli.git |

The `zcode-cli` gitlink is pinned to `cfd0de239b7d744c4a263abf12357dfc9473bedc` on [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) `main` ([open-dynamic-workflows-plugin PR #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) merged ~19:11Z, `4cfd771`). Nested `open-dynamic-workflows` is `2c9a91985e237440b54c1c3d9824f46268e742ac`. Current zcode-cli `main` tip is `cfd0de2` (matches pin). Recursive `git submodule update --init` against the true-fork remote succeeds at `cfd0de2`. This catalog does not bump marketplace pins. Live smoke still **not run — Lane B awaiting Jay credentials**.

## Marketplace `.gitmodules`

This repo (`atebites-plugins`):

| Path | URL |
| --- | --- |
| `plugins/open-dynamic-workflows` | https://github.com/atebites-hub/open-dynamic-workflows-plugin.git |
| `plugins/ponytail` | https://github.com/atebites-hub/ponytail.git |
| `plugins/advisor` | https://github.com/atebites-hub/advisor.git |
| `plugins/taskboard/upstream` | https://github.com/atebites-hub/taskboard.git |
| `plugins/j-space/vendor/j-space-cognition-suite` | https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6.git |
| `plugins/superpowers` | https://github.com/obra/superpowers.git |

The Advisor gitlink path is `plugins/advisor`, pinned to `6d2b562ec7b29d98792d83999eea3760a1365056` (matches `main` tip after [advisor #10](https://github.com/atebites-hub/advisor/pull/10)). Alignment docs landed; alignment status still unproven until live QA. Productize scrub landed. The nested Codex package inside that checkout remains `plugins/advisor/plugins/sol-advisor`. Claude `nativeAdvisor` is still unverified (fixture follow-up).

`plugins/ponytail` marketplace pin is `911022dc1fb868b42e006c1848aaf16b0867de2f`. Fork `main` tip may be `908e5c4d5c324cb8eceddf64814c2b19a6334b88` — pin ≠ tip. Ponytail is the **Factory-required** default candidate (Jay). Bump this gitlink only after fork CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix).

`plugins/superpowers` is the factory-default pin: commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (annotated tag v6.3.0), not a floating `branch = main`. Assistant will wire project-factory `enabledPlugins` to include ponytail alongside Superpowers. Pin bumps here only after fork CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix). This index does not change marketplace SHAs.

## P1 next

1. **Lane B live smoke** (Jay credentials) — box already at `cfd0de2`; Factory QA Lane A APPROVE; live smoke still **not run — Lane B awaiting Jay credentials**. Other marketplace pins still only after smoke.
2. **Marketplace pin bumps only after QA playtest / smoke.** Advisor gitlink is `6d2b562e` (matches tip after alignment docs #10; alignment still unproven until live QA). Nested ODW `zcode-cli` pin on plugin `main` is `cfd0de2` (matches tip). Do not bump ponytail, Superpowers, ODW, or other marketplace SHAs from this catalog. Record `not run — Lane B awaiting Jay credentials` instead of fake green.
3. **Optional remaining sync dry-runs** (`workflow_dispatch` on each `sync-upstream.yml`). ODW-plugin `sync-nested-pins.yml` already opened and merged #15; ponytail dispatch exits with "nothing to sync".
4. **Confirm ponytail in project-factory `enabledPlugins`** (Assistant Epic 1). Marketplace pin stays `911022dc`; bump after smoke if tip (`908e5c4d`) is ahead.

No factory-policy/gitnexus in this catalog yet.
