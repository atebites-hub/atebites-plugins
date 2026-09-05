# Shared seating checklist (SPIKE stub)

**Not a pass.** Checking a box is an operator or Factory QA act. Scripts in
this pack only print this list. They do not mark items done. They do not
attest. Lane B stays fail-closed: record
`not run — Lane B awaiting Jay credentials` instead of inventing green.

Seat **only** Factory defaults: Superpowers, ponytail, Advisor, ODW.
Do **not** seat CE, taskboard, or j-space.
Do **not** seat factory-policy (Upcoming / P2 spike only — see
[`docs/SPIKE-FACTORY-POLICY.md`](../../../docs/SPIKE-FACTORY-POLICY.md)).

## Every host

- [ ] Catalog pins confirmed. This pack does **not** bump SHAs.
      Superpowers `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (v6.3.0);
      ponytail `911022dc1fb868b42e006c1848aaf16b0867de2f`;
      Advisor `39bc5f1d6ce31265f0667f4c11d0b66a4fe38544`;
      ODW plugin `9708a77aebe1b0b06b20150d5f799e4a28e5a14a` / **0.3.0**.
- [ ] Marketplace added (`atebites-hub/atebites-plugins`).
- [ ] Superpowers installed and enabled.
- [ ] ponytail installed and enabled.
- [ ] Advisor installed and enabled (`advisor@atebites-plugins`; package
      coordinate may still be `sol-advisor@sol-advisor`).
- [ ] ODW **0.3.0** installed and enabled as canonical
      `open-dynamic-workflows@open-dynamic-workflows`.
- [ ] Marketplace twin `open-dynamic-workflows@atebites-plugins` only if
      wanted. Twin is optional and does **not** satisfy doctor.
- [ ] `advisor doctor --host <host>` run. Read the JSON. Do not treat
      presence of output as Lane B.
- [ ] `odwPlugin.compatible` is `true` only when the canonical id is
      enabled at 0.3.0 on **this** host. `package.json` 0.3.0 is not enough.
- [ ] No CE / taskboard / j-space seated as Factory defaults.
- [ ] factory-policy not installed as a default.
- [ ] No marketplace product named `factory-harness`.

## Codex extras

- [ ] `/hooks` reviewed and trusted by a **user**.
- [ ] Never used `--dangerously-bypass-hook-trust`.
- [ ] Untrusted / disabled / crashed hooks ⇒ lane unsupported (not a pass).
- [ ] `$advisor apply --host codex` (or `configure`) if settings empty.

## ZCode extras

- [ ] Doctor read `.plugins[].id` (advisor tip `8fc0bcf0` / PR #12).
- [ ] `$advisor apply --host zcode` (or `configure`) if
      `plugin_settings_required`.
- [ ] Fresh session after settings changes.

## One-leaf ODW (optional, fail-closed)

- [ ] Live session called `workflow()` (this pack did not auto-launch).
- [ ] `--run-dir` is an **absolute** path to one run
      (`/absolute/.odw/.../runs/run-ID`).
- [ ] Inspector / `smoke-odw-one-leaf.sh --host <codex|zcode> --run-dir …`
      accepted a completed one-leaf (`agent_count == 1`).
- [ ] Missing checkout, wrong version, `compatible=false`, or a non-one-leaf
      run recorded as **failure**. No auto-fake `PASS`.

## Lane B

- [ ] Live smoke either ran under Jay credentials or is recorded
      `not run — Lane B awaiting Jay credentials`.
- [ ] No invented attestation.
