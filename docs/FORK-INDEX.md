# Fork maintenance index

Status of every marketplace submodule and nested fork against [FORK-MAINTENANCE.md](FORK-MAINTENANCE.md).

Verified **2026-09-05** via GitHub API (`parent`, `fork`, `UPSTREAM.md`, compare). D3-A has landed: [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) is a true fork of [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli). [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades onto true-fork `main` (`040993c`). [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged the first `chore: sync upstream`. `main` tip is `cfd0de2` (after [PR #3](https://github.com/atebites-hub/zcode-cli/pull/3) CI hygiene) and the fork is **behind kingsword09/main by 0**. `UPSTREAM.md` and weekday `.github/workflows/sync-upstream.yml` (`workflow_dispatch` + weekday cron) are present. `UPSTREAM_SYNC_TOKEN` is set as a repo secret on all six (zcode-cli, open-dynamic-workflows, open-dynamic-workflows-plugin, ponytail, advisor, taskboard). Unattended `createPullRequest` is validated: Actions opened [open-dynamic-workflows-plugin #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) (`chore: sync nested pins`) after the wider token was re-set (~19:04Z); #15 merged ~19:11Z (`4cfd771`). Prior failure mode, before the wider token: ponytail could push the sync branch but the PR had to be opened manually ([#4](https://github.com/atebites-hub/ponytail/pull/4), now merged). True forks are **behind_by 0**; ponytail `workflow_dispatch` exits with "nothing to sync". Fleet forks now have the same UPSTREAM + weekday sync artifacts: [open-dynamic-workflows #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9), [ponytail #2](https://github.com/atebites-hub/ponytail/pull/2), [taskboard #1](https://github.com/atebites-hub/taskboard/pull/1), [advisor #7](https://github.com/atebites-hub/advisor/pull/7). ODW plugin [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md`, nested `.github/workflows/sync-nested-pins.yml`, and retargeted the `zcode-cli` gitlink to `040993c`. [PR #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) then moved nested pins on `main` to zcode-cli `cfd0de2` / ODW core `2c9a919`. Factory QA Lane A APPROVE; live smoke still **not run — Lane B awaiting Jay credentials**. Former orphan HEAD is [atebites-hub/zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) (`227b592`). Advisor (`atebites-hub/advisor`, renamed from `atebites-hub/sol-advisor`) parent is [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor).

## Factory story (Jay 2026-09-05)

Kept in the Factory story:

- **Superpowers** — factory-default pin @ **v6.3.0** / `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`. Assistant will wire project-factory `enabledPlugins`.
- **ponytail** — **Factory-required** @ `911022dc1fb868b42e006c1848aaf16b0867de2f` (pin ≠ tip `908e5c4d`; bump only after CI + smoke). Assistant will wire project-factory `enabledPlugins` alongside Superpowers.
- **Advisor** — Factory @ `39bc5f1d6ce31265f0667f4c11d0b66a4fe38544` (matches tip after [advisor #11](https://github.com/atebites-hub/advisor/pull/11)). ZCode apply/configure + ODW seating smoke + `installHint` landed; alignment still unproven until live QA.
- **ODW** — Factory-required. Native alignment unproven until QA.

Discarded from Factory (same class):

- **taskboard** and **j-space** — not Factory defaults; not wired into project-factory; discarded from the Factory story. Marketplace may keep the repos/submodules as catalog entries for optional install only. Not optional defaults. Not factory-default candidates.
- **CE** (Compound Engineering / `compound-engineering`) — discarded entirely. No default, no thin opt-in, no marketplace CE entry. Do not add a CE product.

## Marketplace products

| Product | atebites repo | Upstream | GitHub fork? | UPSTREAM.md | Sync loop | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| zcode-cli | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) | yes | yes | yes (workflow present) | [PR #1](https://github.com/atebites-hub/zcode-cli/pull/1) merged factory upgrades @ `040993c`. [PR #2](https://github.com/atebites-hub/zcode-cli/pull/2) merged first `chore: sync upstream`; `main` tip `cfd0de2` after [PR #3](https://github.com/atebites-hub/zcode-cli/pull/3); behind kingsword09/main by **0**. `UPSTREAM_SYNC_TOKEN` is set / unattended sync validated (workflow_dispatch success after sync #2). [zcode-cli-legacy](https://github.com/atebites-hub/zcode-cli-legacy) kept for history (old ODW pin `a97033fe` lives there). ODW plugin gitlink on `main` is `cfd0de2` after [plugin #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15). |
| ODW core | [atebites-hub/open-dynamic-workflows](https://github.com/atebites-hub/open-dynamic-workflows) | [imsai-sh/open-dynamic-workflows](https://github.com/imsai-sh/open-dynamic-workflows) | yes | yes | yes (workflow present) | Parent linked. **Factory-required.** Native alignment unproven until QA. [PR #9](https://github.com/atebites-hub/open-dynamic-workflows/pull/9) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| ODW plugin | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) | packaging over core + zcode | NO | yes | yes (nested workflow present) | Marketplace packaging (`fork: false`). **Factory-required.** Native alignment unproven until QA. [PR #13](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/13) merged `UPSTREAM.md` + weekday `.github/workflows/sync-nested-pins.yml`. Nested pins on `main` after [PR #15](https://github.com/atebites-hub/open-dynamic-workflows-plugin/pull/15) (`4cfd771`): `zcode-cli` `cfd0de2`, ODW core `2c9a919`. Live smoke **not run — Lane B awaiting Jay credentials**. |
| ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | yes | yes | yes (workflow present) | Parent linked. **Factory-required** (Jay 2026-09-05) @ `911022dc1fb868b42e006c1848aaf16b0867de2f`. Fork `main` tip `908e5c4d5c324cb8eceddf64814c2b19a6334b88` — pin ≠ tip; bump only after CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix). [PR #2](https://github.com/atebites-hub/ponytail/pull/2) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| Advisor | [atebites-hub/advisor](https://github.com/atebites-hub/advisor) | [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor) | yes | yes | yes (workflow present) | Factory story. GitHub rename `atebites-hub/sol-advisor` → `atebites-hub/advisor` (parent unchanged; old URL redirects). Catalog slug and checkout path are `advisor` / `plugins/advisor`. Upgrade: install `advisor` from this marketplace (was `sol-advisor`). Productize scrub landed ([PR #9](https://github.com/atebites-hub/advisor/pull/9)); Factory QA Lane A PASS. ODW native-alignment docs landed ([PR #10](https://github.com/atebites-hub/advisor/pull/10)); ZCode apply/configure + ODW seating smoke + `installHint` landed ([PR #11](https://github.com/atebites-hub/advisor/pull/11)); alignment still unproven until live QA. Pin matches `main` tip `39bc5f1d6ce31265f0667f4c11d0b66a4fe38544`. Inner package path and coordinate remain `plugins/sol-advisor` / `sol-advisor@sol-advisor`. Claude `nativeAdvisor` still unverified — fixture follow-up. [PR #7](https://github.com/atebites-hub/advisor/pull/7) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| taskboard | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) | [tcarac/taskboard](https://github.com/tcarac/taskboard) | yes | yes | yes (workflow present) | Parent linked. **Not a Factory default.** Discarded from the Factory story (Jay 2026-09-05); not wired into project-factory; same class as CE. Catalog submodule remains for optional install only. [PR #1](https://github.com/atebites-hub/taskboard/pull/1) merged `UPSTREAM.md` + weekday `.github/workflows/sync-upstream.yml`. |
| j-space | vendor only | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) | n/a | n/a | n/a | No atebites fork by design. **Not a Factory default.** Discarded from the Factory story (Jay 2026-09-05); not wired into project-factory; same class as CE. Catalog vendor submodule remains for optional install only. |
| Superpowers | pin only (not an atebites fork) | [obra/superpowers](https://github.com/obra/superpowers) | n/a | n/a | n/a | Factory-default pin. [obra/superpowers](https://github.com/obra/superpowers) @ **v6.3.0** / `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`. Assistant will wire project-factory `enabledPlugins` for Superpowers and ponytail (Factory-required). Not taskboard, j-space, or CE. |

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

The Advisor gitlink path is `plugins/advisor`, pinned to `39bc5f1d6ce31265f0667f4c11d0b66a4fe38544` (matches `main` tip after [advisor #11](https://github.com/atebites-hub/advisor/pull/11)). Factory story. ZCode apply/configure + ODW seating smoke + `installHint` landed; alignment status still unproven until live QA. Productize scrub landed. The nested Codex package inside that checkout remains `plugins/advisor/plugins/sol-advisor`. Claude `nativeAdvisor` is still unverified (fixture follow-up).

`plugins/ponytail` marketplace pin is `911022dc1fb868b42e006c1848aaf16b0867de2f`. Fork `main` tip may be `908e5c4d5c324cb8eceddf64814c2b19a6334b88` — pin ≠ tip. Ponytail is **Factory-required** (Jay 2026-09-05). Bump this gitlink only after fork CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix).

`plugins/superpowers` is the factory-default pin: commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (annotated tag v6.3.0), not a floating `branch = main`. Assistant will wire project-factory `enabledPlugins` to include ponytail alongside Superpowers. Pin bumps here only after fork CI + [smoke](FORK-MAINTENANCE.md#smoke-matrix). This index does not change marketplace SHAs.

`plugins/taskboard/upstream` and `plugins/j-space/vendor/j-space-cognition-suite` stay as catalog submodules (non-Factory). They are **not** Factory defaults, **not** wired into project-factory, and are discarded from the Factory story. Optional catalog install only. No CE gitlink — CE has no marketplace entry.

## P1 next

1. **Lane B live smoke** (Jay credentials) — box already at `cfd0de2`; Factory QA Lane A APPROVE; live smoke still **not run — Lane B awaiting Jay credentials**. Other marketplace pins still only after smoke.
2. **Marketplace pin bumps only after QA playtest / smoke.** Advisor gitlink is `39bc5f1d` (matches tip after ZCode apply/configure + ODW seating smoke #11; alignment still unproven until live QA). Nested ODW `zcode-cli` pin on plugin `main` is `cfd0de2` (matches tip). Do not bump ponytail, Superpowers, ODW, or other marketplace SHAs from this catalog. Record `not run — Lane B awaiting Jay credentials` instead of fake green. ODW native alignment remains unproven until QA.
3. **Optional remaining sync dry-runs** (`workflow_dispatch` on each `sync-upstream.yml`). ODW-plugin `sync-nested-pins.yml` already opened and merged #15; ponytail dispatch exits with "nothing to sync".
4. **Confirm ponytail in project-factory `enabledPlugins`** (Assistant Epic 1). Superpowers stays the factory-default pin. Do not wire taskboard, j-space, or CE (discarded from Factory; CE has no marketplace entry). Marketplace pin stays `911022dc`; bump after smoke if tip (`908e5c4d`) is ahead.
5. **Upcoming / P2 spike (not done as a Factory default):** `plugins/factory-policy/` is an **inline SPIKE stub** (not a submodule, not a catalog plugin, not factory-default, not wired into project-factory `enabledPlugins`). Nested `memory-system` stays inside factory-policy. Named checks: C3.1 doc-cited, C3.2 scope-literal, C3.3 plan-filled, C5 gate-runnable, C6 issue-linked, C7 plan-approved. Hooks/scripts are stubs (exit 0, not enforcing; no soft-pass). See [SPIKE-FACTORY-POLICY.md](SPIKE-FACTORY-POLICY.md). Still later: linear-tracking pin path; GitNexus wrap. This catalog does not promote them to Factory defaults.
