# host-adapters

**SPIKE — not a Factory default. Not a bot. Not production seating.**

Inline marketplace **docs+scripts** pack in
[atebites-plugins](https://github.com/atebites-hub/atebites-plugins).
Not a submodule. Not listed in host catalogs. Not wired into project-factory
`enabledPlugins`. Not the Factory Harness **bot** (that bot stays box
installs/ops only — do not replace it).

Normative spike scope: [`docs/SPIKE-HOST-ADAPTERS.md`](../../docs/SPIKE-HOST-ADAPTERS.md).

Pack name is **`host-adapters`**. Rejected names: `factory-harness` (confused
with the bot), `factory-host-adapters` (alias).

## What this is

Per-host install/seat recipes for **existing** Factory defaults
(Superpowers, ponytail, Advisor, ODW). Codex and ZCode ship first — they
are the current seating pain. Cursor / Claude / Antigravity are honest
placeholders.

Scripts print recipe steps and exit 0 with `SPIKE stub`. They do **not**
install plugins, trust hooks, launch a run, or attest Lane B. Do not treat
stub success as a seating pass (no soft-pass).

## Recipes

| Host | File | Status |
| --- | --- | --- |
| Codex | [`hosts/codex.md`](hosts/codex.md) | Recipe (seating pain) |
| ZCode | [`hosts/zcode.md`](hosts/zcode.md) | Recipe (seating pain) |
| Cursor / Claude / Antigravity | [`hosts/CHECKLIST.md`](hosts/CHECKLIST.md) | Placeholder / parked |

Print the steps without running them:

```bash
bash plugins/host-adapters/scripts/print-recipe.sh --host codex
bash plugins/host-adapters/scripts/print-recipe.sh --host zcode
bash plugins/host-adapters/scripts/print-recipe.sh --host checklist
```

## Plugin id map (doctor)

Copied from Advisor — do not invent a second id:

| Fact | Value |
| --- | --- |
| Canonical ODW id | `open-dynamic-workflows@open-dynamic-workflows` |
| Required version | `0.3.0` (installed **and** enabled) |
| ZCode list shape | `.plugins[].id` (in catalog pin `bdcf8d5d…` after Advisor [#12](https://github.com/atebites-hub/advisor/pull/12) / marketplace [#22](https://github.com/atebites-hub/atebites-plugins/pull/22)) |
| Marketplace twin | `open-dynamic-workflows@atebites-plugins` — **does not satisfy doctor alone** |
| One-leaf | launch `workflow()` first, then `--run-dir` (Advisor [#13](https://github.com/atebites-hub/advisor/pull/13) / marketplace [#25](https://github.com/atebites-hub/atebites-plugins/pull/25)) |

Cite catalog Advisor pin `bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3`. This
pack does not bump that gitlink.

## Not in this pack

- Factory Harness bot (box installs/ops — leave it)
- Anything named `factory-harness` or `factory-host-adapters`
- Catalog install as a factory-default
- CE, taskboard, j-space
- Hook auto-trust / `--trust`
- Lane B attestation / soft-pass
- Pin bumps of Superpowers / ponytail / Advisor / ODW

## Opt-in (spike only)

Hosts do not install this from the marketplace. After a local clone, read
the host file and/or print the recipe. There is no `--plugin-dir` product
and no `$host-adapters` command that seats a box.
