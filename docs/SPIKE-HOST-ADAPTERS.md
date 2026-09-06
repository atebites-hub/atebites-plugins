# SPIKE: host-adapters (per-host seating pack)

**Status:** SPIKE. Docs + thin script stubs for per-host install/seat of
Factory defaults.
**Not** a Factory default. **Not** a bot. **Not** production seating.
**Not** a marketplace catalog product until QA proves it.

This catalog spike scaffolds `plugins/host-adapters/` as an **inline**
docs+scripts pack (not a submodule). Host marketplaces do **not** list it.
Do not wire project-factory `enabledPlugins`. Do not treat stub exit 0 as a
seating pass (no soft-pass). Do not auto-trust Codex `/hooks`.

The pack name is **`host-adapters`**. Jay likes this name.

| Rejected name | Why |
| --- | --- |
| `factory-harness` | Confused with the Factory Harness **bot**. **Killed** as a marketplace / pack name. Do not scaffold it. |
| `factory-host-adapters` | Rejected alias. Do not use it in catalogs, paths, or install commands. |

## Binding SoT (do not invent ownership)

Ownership below is the Jay lock for this spike (2026-09-05). Do not invent
new owners, bots, or Factory defaults.

| Piece | Owns | Does not own |
| --- | --- | --- |
| **Factory Harness bot** | Box installs / ops only | Per-host seating recipes; marketplace product; this pack |
| **`host-adapters` pack** | Docs + scripts that walk an operator through pin → install/enable → `advisor doctor --host X` → user-gated hook trust → optional one-leaf | Being a bot; replacing Factory Harness bot; being a Factory default until QA; Lane B attestation |
| **Factory defaults** (Superpowers, ponytail, Advisor, ODW) | Product pins already in this catalog. Factory seats ponytail at intensity **full** always (never lite). | Promotion of `host-adapters`; CE / taskboard / j-space |
| **Advisor `doctor --host`** | Compatibility / seating checks, including the canonical ODW plugin id | Treating the marketplace twin as equivalent; auto-trust; inventing attestation |
| **Codex `/hooks`** | User-gated lifecycle-hook trust | Bypass / `--trust` from this pack's scripts |
| **ODW one-leaf** | Operator launches `workflow()` (workflow MCP or equivalent), then points `--run-dir` at that run | Auto-launch; soft-pass on `compatible=false` |

Factory Harness **bot** stays box installs/ops only. This pack must **never**
replace it. The killed name `factory-harness` must not reappear as a
marketplace product.

Advisor seating facts used here are copied from Advisor (not invented):

- Doctor expects **`open-dynamic-workflows@open-dynamic-workflows` at 0.3.0**,
  installed and **enabled**.
- ZCode `plugins list --json` shape is **`.plugins[].id`** (plus `version`,
  `enabled`).
- Marketplace twin **`open-dynamic-workflows@atebites-plugins` does not satisfy doctor alone**.
- Catalog Advisor pin **`bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3`**
  (marketplace [#22](https://github.com/atebites-hub/atebites-plugins/pull/22)
  matcher @ `8fc0bcf0…` + [#25](https://github.com/atebites-hub/atebites-plugins/pull/25)
  docs @ `bdcf8d5d…`) includes the ZCode `.plugins[]` matcher (Advisor
  [#12](https://github.com/atebites-hub/advisor/pull/12)) and one-leaf
  launch-then `--run-dir` docs (Advisor
  [#13](https://github.com/atebites-hub/advisor/pull/13)). **This spike
  does not bump Superpowers / ponytail / Advisor / ODW pins.**
- Optional one-leaf path: launch a one-leaf `workflow()` first, then
  `smoke-odw-one-leaf.sh --host <codex\|zcode> --run-dir /absolute/.odw/.../runs/run-ID`.
  Smoke does not auto-launch. Stay fail-closed.

Current catalog pins (cite only; do not change in this PR):

| Product | Marketplace pin (this repo) |
| --- | --- |
| Superpowers | `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (v6.3.0) |
| ponytail | `911022dc1fb868b42e006c1848aaf16b0867de2f` |
| Advisor | `bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3` (includes `.plugins[]` matcher + launch→`--run-dir` docs) |
| ODW plugin | `a7a07a886cecf767246abf21f2baf2dd10473d17` |

## Goal

Give operators a **per-host install/seat recipe** for the Factory defaults
that already exist in this catalog. Codex and ZCode are the current seating
pain; they ship first. Cursor / Claude / Antigravity stay honest checklist
placeholders.

This pack is **not** a Factory default until live QA proves seating. It is
**not** a bot.

## Layout

```text
plugins/host-adapters/
  README.md                 # SPIKE / not Factory-default / not a bot
  hosts/codex.md            # Codex recipe (current seating pain)
  hosts/zcode.md            # ZCode recipe (current seating pain)
  hosts/CHECKLIST.md        # Cursor / Claude / Antigravity placeholders
  scripts/print-recipe.sh   # print steps; exit 0; SPIKE stub; no auto-trust
```

## In scope (this spike)

- Binding spike doc at `docs/SPIKE-HOST-ADAPTERS.md`
- Inline pack under `plugins/host-adapters/` (not a submodule)
- Codex + ZCode recipes: pin SHA → install/enable → `advisor doctor --host X`
  → Codex `/hooks` trust (user-gated; no bypass) → optional one-leaf via
  workflow MCP then `--run-dir`
- Plugin-id map (canonical ODW id, ZCode `.plugins[]`, marketplace twin)
- Shared checklist stub for Cursor / Claude / Antigravity
- Thin scripts that **print** recipe steps and exit 0 with `SPIKE stub`
- README / FORK-INDEX **Upcoming / P2–P3 spike** mention only

## Out of scope

- **No `factory-harness` pack, path, or catalog name.**
- **No replacement of Factory Harness bot** (box installs/ops only).
- **No Factory-default / catalog listing** until QA explicitly promotes it.
- **No Superpowers / ponytail / Advisor / ODW pin bumps** in this PR.
- **No soft-pass Lane B** / invented attestation.
- **No CE / taskboard / j-space** (discarded from Factory; not defaults).
- **No auto-trust** of Codex `/hooks` (no `--trust` flags, no writing trusted
  hook state).
- **No claim that `host-adapters` is production seating.**
- **No `enabledPlugins` wiring** in project-factory from this catalog.
- **No factory-policy / linear-tracking / GitNexus work** in this PR.

## Host recipes (summary)

Full steps live under `plugins/host-adapters/hosts/`. Shared sequence:

1. **Pin SHA** — use the catalog pins in the table above. Do not float `main`.
2. **Install / enable** Factory defaults on that host.
3. **`advisor doctor --host X`** — fail-closed. Canonical ODW id at 0.3.0
   enabled. Marketplace twin `@atebites-plugins` is not enough.
4. **Codex `/hooks` trust** — operator reviews and trusts in the UI. Scripts
   must not bypass this. (ZCode has no Codex `/hooks` step; do not invent one.)
5. **Optional one-leaf** — operator launches `workflow()` via workflow MCP
   (or equivalent host path), then passes `--run-dir` to Advisor's one-leaf
   smoke. This pack does not launch or attest.

ZCode extra: doctor on catalog pin `bdcf8d5d…` reads `.plugins[]`. One-leaf
smoke is launch-then `--run-dir`. Do not bump the gitlink from this pack.

## Catalog posture

Host `marketplace.json` files still list exactly the six catalog plugins.
`plugins/host-adapters/` is in-tree so a later PR can point at it without a
submodule. Until QA: document under Upcoming / P2–P3 spike only. If a later
PR adds a catalog row for discoverability, it must say **SPIKE / non-default**
in the entry itself. This PR does not add that row.

## Stub vs later

**In this PR (stub):**

- Spike doc + pack README labeled SPIKE / not Factory-default / not a bot
- Codex + ZCode recipes + shared checklist placeholders
- Scripts that print steps, print `SPIKE stub`, and exit 0
- README / FORK-INDEX **Upcoming / P2–P3 spike** mention only

**Later (not this PR):**

- Proven seating on a live box (Lane B with Jay credentials)
- Catalog entry or Factory-default promotion
- Cursor / Claude / Antigravity recipes with real doctor evidence
- Advisor / ODW pin bumps (separate PRs after CI + smoke)
- Any automation that trusts hooks or launches a run
- Replacing or wrapping Factory Harness bot

## Success for this spike

PR with this doc + Codex/ZCode recipes + ownership table; SPIKE labels;
rejected names recorded; not merged as a Factory-default or catalog product.
Do not claim production seating.
