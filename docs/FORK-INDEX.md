# Fork maintenance index

P1 tracker for marketplace submodules and nested forks against [FORK-MAINTENANCE.md](FORK-MAINTENANCE.md). This file does not bump pins.

Verified 2026-09-04; re-checked 2026-09-05 with `gh api` (`parent`, `fork`, `UPSTREAM.md`, `.github/workflows`).

| Product | atebites repo | Upstream | GitHub fork? | UPSTREAM.md | Sync loop | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| zcode-cli | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) | no (orphan) | missing | missing | P1 critical; ODW plugin submodule |
| ODW core | [atebites-hub/open-dynamic-workflows](https://github.com/atebites-hub/open-dynamic-workflows) | [imsai-sh/open-dynamic-workflows](https://github.com/imsai-sh/open-dynamic-workflows) | yes | missing | missing | Parent linked; needs UPSTREAM + weekly sync |
| ODW plugin | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) | packaging over core+zcode | no | missing | missing | Marketplace submodule; sync story = core + zcode pins |
| ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | yes | missing | missing | Parent linked |
| sol-advisor | [atebites-hub/sol-advisor](https://github.com/atebites-hub/sol-advisor) | [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor) | yes | missing | missing | Marketplace; parent linked |
| taskboard | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) | [tcarac/taskboard](https://github.com/tcarac/taskboard) | yes | missing | missing | Parent linked |
| j-space | vendor only | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) | n/a | n/a | n/a | No atebites fork by design |

"Sync loop" means a weekly workflow that runs on a weekday (or equivalent) and opens `chore: sync upstream` when upstream moved. Existing CI (`ci.yml`, `test.yml`, …) is not a sync loop.

## Nested pins

Gitlink SHAs below are the current catalog / plugin pins. Do not bump them from this docs change.

### This catalog (`.gitmodules`)

| Path | URL | Pin |
| --- | --- | --- |
| `plugins/open-dynamic-workflows` | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) | `9ddd39a59877` |
| `plugins/ponytail` | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) | `911022dc1fb8` |
| `plugins/sol-advisor` | [atebites-hub/sol-advisor](https://github.com/atebites-hub/sol-advisor) | `a47ece91a3a0` |
| `plugins/taskboard/upstream` | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) | `ed227b3c01c7` |
| `plugins/j-space/vendor/j-space-cognition-suite` | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) | `cfde6a2d08ae` |

### ODW plugin (`.gitmodules` in `open-dynamic-workflows-plugin`)

Nested under the ODW plugin pin above (`9ddd39a59877`, which is that repo's `main` as of the re-check).

| Path | URL | Pin |
| --- | --- | --- |
| `open-dynamic-workflows` | [atebites-hub/open-dynamic-workflows](https://github.com/atebites-hub/open-dynamic-workflows) | `036701b1fddd` |
| `zcode-cli` | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | `a97033febe28` (not on current orphan; `upload-pack: not our ref`) |

## P1 next

1. True-fork **zcode-cli** via D3-A: rename the orphan to `zcode-cli-legacy`, fork [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) as `zcode-cli`, port atebites upgrades.
2. Add `UPSTREAM.md` and the weekly sync loop (weekday) on every linked fork (ODW core, ponytail, sol-advisor, taskboard).
3. Bump marketplace pins only after fork CI + the [smoke matrix](FORK-MAINTENANCE.md#smoke-matrix).

No factory-policy / gitnexus work in this slice.
