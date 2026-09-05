# Fork maintenance index

Status of every marketplace submodule and nested fork against [FORK-MAINTENANCE.md](FORK-MAINTENANCE.md).

Verified **2026-09-05** via GitHub API (`parent`, `fork`, `UPSTREAM.md`). Matches the 2026-09-04 snapshot; sol-advisor parent resolved to [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor).

| Product | atebites repo | Upstream | GitHub fork? | UPSTREAM.md | Sync loop | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| zcode-cli | [atebites-hub/zcode-cli](https://github.com/atebites-hub/zcode-cli) | [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) | NO (orphan) | missing | missing | P1 critical; ODW plugin submodule |
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

1. **True-fork zcode-cli** (D3-A planned): rename the orphan to `zcode-cli-legacy`, fork [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) as `zcode-cli`, port atebites upgrades.
2. **UPSTREAM.md + weekly sync** on GitHub-linked forks (ODW core, ponytail, sol-advisor, taskboard).
3. **Pin bumps only after smoke.** Record `not run — harness absent` instead of fake green.

No factory-policy/gitnexus in this catalog yet.
