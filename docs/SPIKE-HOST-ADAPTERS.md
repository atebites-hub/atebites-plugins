# SPIKE: host-adapters (per-host Factory seating)

**Status:** SPIKE. Documentation + print/help scripts for seating Factory
defaults on a host. **Upcoming / P2–P3** only.
**Not** a Factory default. **Not** a second Harness bot. **Not** a
marketplace catalog plugin. **Not** Lane B attestation.

This catalog spike scaffolds `plugins/host-adapters/` as an **inline** pack
(not a submodule). Host marketplaces do **not** list it. Do not wire
project-factory `enabledPlugins`. Do not treat script exit 0 as a seating
pass (no soft-pass). Do not invent Lane B attestation.

**Name lock:** `host-adapters`. Not `factory-host-adapters`. Not
`factory-harness`. Kill any marketplace name `factory-harness`.

## Binding SoT (do not invent)

Jay 2026-09-05 Factory defaults to **seat** (do not add CE / taskboard /
j-space):

| Default | Marketplace pin (do not bump from this pack) |
| --- | --- |
| Superpowers | obra/superpowers **v6.3.0** / `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` |
| ponytail | `911022dc1fb868b42e006c1848aaf16b0867de2f` (pin ≠ tip; bump only after CI + smoke) |
| Advisor | `39bc5f1d6ce31265f0667f4c11d0b66a4fe38544` (catalog pin after advisor #11). Tip `8fc0bcf017fc19559e0117a47be5dec2558ed43a` (advisor #12) is the ZCode `.plugins[].id` matcher — cite it; do not bump the gitlink here. |
| ODW | plugin `9708a77aebe1b0b06b20150d5f799e4a28e5a14a` / product **0.3.0**. Native alignment unproven until QA. |

**factory-policy** is a separate **Upcoming / P2** spike
([SPIKE-FACTORY-POLICY.md](SPIKE-FACTORY-POLICY.md)). Point at it. Do not
seat it. Do not promote it to a Factory default from this pack.

C3–C7 / memory-gate contract lives in factory-policy. This pack does not
own those checks.

## Problem

Factory defaults exist as marketplace pins. Seating them on a **live host**
is still tribal knowledge. Codex and ZCode are the current pain:

1. **Pin → install → enable → doctor** is not written as one recipe. Operators
   bump SHAs, skip enable, or treat marketplace `package.json` 0.3.0 as
   seated.
2. **ODW 0.3.0 IDs diverge.** Advisor doctor requires the canonical plugin
   id `open-dynamic-workflows@open-dynamic-workflows` at **0.3.0** with
   `enabled == true`. The atebites-plugins marketplace twin
   `open-dynamic-workflows@atebites-plugins` is optional and does **not**
   satisfy `odwPlugin.compatible`.
3. **ZCode doctor used Codex list shapes.** ZCode `plugins list --json`
   exposes top-level `.plugins[]` (`id`, `version`, `enabled`). A doctor
   that only reads Codex `.installed[]` / `.installedPlugins[]` reports
   `compatible=false` on a correctly enabled 0.3.0 plugin. Advisor tip
   `8fc0bcf0` (PR #12) reads `.plugins[].id`. This pack documents that
   tip; it does not bump the catalog pin.
4. **Codex hook trust is user-gated.** After install, the human reviews
   `/hooks`. `--dangerously-bypass-hook-trust` is forbidden. Disabled,
   untrusted, crashed, timed-out, malformed, or bypassed hooks mean the
   lane is unsupported — not a soft-pass.
5. **One-leaf ODW is session-gated.** A real `workflow()` must run in a
   live session, then inspect with an **absolute** `--run-dir`. Auto-launch
   plus a scripted `PASS` is fake Lane B. Missing checkout, wrong version,
   `compatible=false`, or a non-one-leaf run is a failure.

A second marketplace product named `factory-harness` would collide with the
**Factory Harness bot** (box installs/ops). That name is killed.

## Proposal

Ship an in-repo **host-adapters** pack: recipes + a shared checklist + thin
scripts that **print/help only**. Start with **Codex + ZCode**. Later hosts
copy the same spine (pin SHA → install/enable → `advisor doctor --host X`)
without becoming a bot.

This pack does **not** install plugins. It does **not** trust hooks. It
does **not** launch `workflow()`. It does **not** attest. Factory QA
consumes the recipes fail-closed. Assistant may link them from
project-factory later.

## Ownership

| Owner | Owns | Does not own |
| --- | --- | --- |
| **Factory Plugins** | This pack in atebites-plugins (`docs/SPIKE-HOST-ADAPTERS.md`, `plugins/host-adapters/`) | Box DISPLAY/certs/logins; Lane B credentials; project-factory `enabledPlugins` |
| **Factory Harness bot** | Box installs/ops only (DISPLAY, certs, logins) | This pack. Never a marketplace plugin named `factory-harness`. |
| **Factory QA** | Playtests that consume these recipes; fail-closed Lane B | Soft-green; invented attestation |
| **Assistant** | project-factory links **later** | Promoting this pack to a Factory default from the catalog |

## In scope (this spike)

- Spike doc + pack README labeled SPIKE / not Factory-default / not a bot
- Codex + ZCode seating recipes for Superpowers, ponytail, Advisor, ODW
- Shared checklist stub (same spine; host-specific rows)
- Thin scripts that print/help only (exit 0, no `PASS`)
- README / FORK-INDEX **Upcoming / P2–P3 spike** mention only
- Explicit kill of marketplace name `factory-harness`
- Pointer to factory-policy as upcoming-only (not seated here)

## Out of scope

- **No `factory-harness` plugin** (name killed). No second Harness bot.
- **No CE / taskboard / j-space** seating. Discarded from Factory.
- **No factory-policy seating.** Upcoming P2 spike only.
- **No catalog listing / Factory-default / `enabledPlugins`.**
- **No pin bumps** of Superpowers / ponytail / Advisor / ODW.
- **No `--dangerously-bypass-hook-trust`.**
- **No auto-fake one-leaf PASS.** No invented Lane B attestation.
- **No Cursor / Claude / Grok / Hermes / Pi recipes** in this spike
  (same spine later; Cursor/Claude ODW executors stay rejected until
  evidence contracts exist).
- **No DISPLAY/certs/login automation** (Harness bot / box only).

## Seating spine (every host)

```text
pin SHA → install → enable → advisor doctor --host <host>
```

Then, only if ODW one-leaf is in play:

```text
live session: workflow() → inspect --run-dir /absolute/.odw/.../runs/run-ID
```

`doctor` is a seating probe, not a Lane B pass. `odwPlugin.compatible=true`
requires the **canonical** ODW id at 0.3.0 enabled on that host. A
marketplace pin or `package.json` version is not enough.

## Codex (current pain)

Normative recipe: [`plugins/host-adapters/recipes/codex.md`](../plugins/host-adapters/recipes/codex.md).

1. Confirm catalog pins (table above). Do not bump from this pack.
2. `codex plugin marketplace add atebites-hub/atebites-plugins`
3. Add Superpowers, ponytail, Advisor from that marketplace.
4. Seat ODW **0.3.0** as `open-dynamic-workflows@open-dynamic-workflows`
   (from `atebites-hub/open-dynamic-workflows-plugin` or an equivalent
   source that yields that id). Twin
   `open-dynamic-workflows@atebites-plugins` is optional.
5. Open `/hooks`. Review and trust Advisor (and any other Factory-default
   lifecycle hooks) as a **user**. Never
   `--dangerously-bypass-hook-trust`. Untrusted hooks ⇒ lane unsupported.
6. `$advisor apply --host codex` (or `configure`) when settings are empty.
7. `$advisor doctor --host codex` — read `odwPlugin.compatible` and hook
   trust. Do not treat JSON presence as Lane B.
8. One-leaf (optional, fail-closed): in a **session**, call `workflow()`
   with absolute `cwd`, then
   `smoke-odw-one-leaf.sh --host codex --run-dir /absolute/...`.
   The script must not auto-launch. This pack must not print `PASS`.

## ZCode (current pain)

Normative recipe: [`plugins/host-adapters/recipes/zcode.md`](../plugins/host-adapters/recipes/zcode.md).

1. Confirm catalog pins. Do not bump from this pack.
2. `/plugins marketplace add atebites-hub/atebites-plugins` (or
   `zcode plugins marketplace add atebites-hub/atebites-plugins`).
3. Install/enable Superpowers, ponytail, Advisor.
4. Seat ODW **0.3.0** as canonical
   `open-dynamic-workflows@open-dynamic-workflows`. Twin
   `@atebites-plugins` optional.
5. `$advisor apply --host zcode` (or `configure`) when
   `plugin_settings_required`.
6. `$advisor doctor --host zcode` — doctor must read ZCode
   `.plugins[].id` (advisor tip `8fc0bcf0` / PR #12). A doctor that only
   understands Codex `.installed[]` is the old bug.
7. One-leaf: session-gated `workflow()`, then absolute `--run-dir`. No
   auto-fake `PASS`.

## Shared checklist

Stub: [`plugins/host-adapters/recipes/CHECKLIST.md`](../plugins/host-adapters/recipes/CHECKLIST.md).

Print-only helper: `plugins/host-adapters/scripts/print-checklist.sh`.
Checking boxes is an operator/QA act. Scripts do not mark items done.

## Stub vs later

**In this PR (stub):**

- This doc + pack README labeled SPIKE / not Factory-default / not a bot
- Codex + ZCode recipes + shared checklist
- Scripts that print help/recipes and exit 0 without claiming a pass
- Host plugin manifests for pack identity (no hooks, no bot)
- README / FORK-INDEX **Upcoming / P2–P3 spike** mention only

**Later (not this PR):**

- Cursor / Claude / Grok / Hermes / Pi recipes
- project-factory links (Assistant)
- Catalog listing or Factory-default promotion after QA proves seating
- Advisor catalog pin bump to `8fc0bcf0` (separate pin PR; not this pack)
- Lane B live smoke (Jay credentials) — record
  `not run — Lane B awaiting Jay credentials` until then
- factory-policy v1 seating (that spike is still upcoming-only)

## Catalog posture

Host `marketplace.json` files still list exactly the six catalog plugins.
`plugins/host-adapters/` is in-tree so a later PR can point sources at it
without a submodule. Until QA promotes it: Upcoming / P2–P3 spike only.
Never publish `factory-harness`.

## Success for this spike

PR with this doc + Codex/ZCode recipes + upcoming-only mentions; SPIKE
labels; not a bot; not merged as a Factory-default; no pin bumps; no
Lane B soft-pass.
