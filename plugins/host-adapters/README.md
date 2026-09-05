# host-adapters

**SPIKE — not a Factory default. Not a bot.**

Inline seating-recipes pack in [atebites-plugins](https://github.com/atebites-hub/atebites-plugins).
Not a submodule. Not listed in host catalogs. Not wired into project-factory
`enabledPlugins`. Not the Factory Harness bot. Not `factory-harness`
(that marketplace name is killed).

Scripts **print/help only**. They do not install, enable, trust hooks,
launch `workflow()`, or attest. Exit 0 means "printed help," not a seating
pass (no soft-pass). Do not invent Lane B attestation.

Normative spike: [`docs/SPIKE-HOST-ADAPTERS.md`](../../docs/SPIKE-HOST-ADAPTERS.md).
factory-policy remains a separate **Upcoming / P2** spike
([`docs/SPIKE-FACTORY-POLICY.md`](../../docs/SPIKE-FACTORY-POLICY.md)) —
point at it; do not seat it from this pack.

## What this is

Documentation + scripts for **per-host install/seat** of Factory defaults:

- Superpowers
- ponytail
- Advisor
- ODW (0.3.0)

Spine: **pin SHA → install/enable → `advisor doctor --host X`**.

Start here: **Codex** and **ZCode** (current pain). Other hosts are later.

## What this is not

- Not a second Harness bot (DISPLAY/certs/logins stay box/Harness-ops)
- Not a Factory default until QA proves seating
- Not CE, taskboard, or j-space
- Not factory-policy (upcoming-only)
- Not a pin-bump PR

## Recipes

| Host | Recipe |
| --- | --- |
| Codex / ChatGPT Codex | [recipes/codex.md](recipes/codex.md) |
| ZCode | [recipes/zcode.md](recipes/zcode.md) |
| Shared checklist | [recipes/CHECKLIST.md](recipes/CHECKLIST.md) |

## Print/help scripts (no soft-pass)

```bash
bash plugins/host-adapters/scripts/print-help.sh
bash plugins/host-adapters/scripts/print-recipe.sh --host codex
bash plugins/host-adapters/scripts/print-recipe.sh --host zcode
bash plugins/host-adapters/scripts/print-checklist.sh
```

Each prints `SPIKE stub` and does **not** claim a seating pass.

## ODW 0.3.0 IDs

| Id | Role |
| --- | --- |
| `open-dynamic-workflows@open-dynamic-workflows` | **Canonical.** Doctor `odwPlugin.compatible=true` requires this id at 0.3.0, enabled. |
| `open-dynamic-workflows@atebites-plugins` | Marketplace twin. Optional. Does not satisfy doctor. |

ZCode doctor must read `.plugins[].id` (advisor tip `8fc0bcf0` / PR #12).
This pack does not bump the Advisor catalog pin (`39bc5f1d`).

## Codex hook trust

User-gated via `/hooks`. **Never** `--dangerously-bypass-hook-trust`.

## One-leaf

Session-gated: **launch** `workflow()` in a live session, **then** inspect
with an **absolute** `--run-dir`. Do not auto-launch. Do not auto-fake a
seating pass. Codex example shape (not a catalog / Lane B claim): Harness
seating-002 at
`…/one-leaf-cwd/.odw/seating-one-leaf/runs/run-mtoxds2b-c5361e` with
`routingPolicy` `codex` / `gpt-5.3-codex-spark` / `medium`. See
[recipes/codex.md](recipes/codex.md).

## Opt-in (spike only)

Hosts do not install this from the marketplace. After a local clone, read
the recipes or print them with the scripts above. v1 + QA are required
before this becomes a catalog plugin or a Factory default.
