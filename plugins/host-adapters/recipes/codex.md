# Codex seating recipe (SPIKE)

**Host:** Codex CLI / ChatGPT Codex app.
**Not** a Factory default pack. **Not** a bot. **Not** Lane B.
Print/help: `bash plugins/host-adapters/scripts/print-recipe.sh --host codex`

Spine: **pin SHA → install/enable → `advisor doctor --host codex`**.

Prefer Codex **ultra mode** when that is the right native orchestrator.
ODW must still align with ultra (detect / compose / defer). Alignment is
unproven until QA. Unused ODW is not a pass.

## 1. Pin SHA (do not bump from this pack)

| Plugin | Catalog pin |
| --- | --- |
| Superpowers | `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (v6.3.0) |
| ponytail | `911022dc1fb868b42e006c1848aaf16b0867de2f` |
| Advisor | `39bc5f1d6ce31265f0667f4c11d0b66a4fe38544` |
| ODW | `9708a77aebe1b0b06b20150d5f799e4a28e5a14a` (product **0.3.0**) |

Do not add CE, taskboard, or j-space. Do not seat factory-policy
(Upcoming / P2 only).

## 2. Install / enable

Factory defaults from this marketplace:

```bash
codex plugin marketplace add atebites-hub/atebites-plugins
codex plugin add superpowers@atebites-plugins
codex plugin add ponytail@atebites-plugins
codex plugin add advisor@atebites-plugins
```

ODW **canonical** id (required for doctor):

```bash
codex plugin marketplace add atebites-hub/open-dynamic-workflows-plugin
codex plugin add open-dynamic-workflows@open-dynamic-workflows
```

Marketplace twin (optional; does **not** satisfy doctor):

```bash
codex plugin add open-dynamic-workflows@atebites-plugins
```

Enable plugins the host left off. Open a **new** Codex thread after
install or hook changes. Plugin install does not put `advisor` on `PATH`;
use `$advisor`.

Advisor package coordinate inside the pin may still be
`sol-advisor@sol-advisor`.

## 3. Codex `/hooks` trust (user-gated)

Open `/hooks`. Review and trust Advisor lifecycle hooks (and any other
Factory-default hooks that shipped). Start a fresh session.

**Never** pass `--dangerously-bypass-hook-trust`.

Disabled, untrusted, crashed, timed-out, malformed, or bypassed hooks
mean the lane is **unsupported**. That is not a seating pass.

## 4. Advisor apply, then doctor

```text
$advisor apply --host codex
$advisor doctor --host codex
```

Or `configure` any catalog-backed advisor/grunt pair, then `apply`.
Doctor is read-only. `plugin_settings_required` means apply/configure
first — not a soft-pass.

`odwPlugin.compatible=true` requires
`open-dynamic-workflows@open-dynamic-workflows` at **0.3.0**, enabled.
`installHint` is `install/enable open-dynamic-workflows@0.3.0` when
compatible is false. The twin `@atebites-plugins` does not count.

## 5. One-leaf (session-gated — no auto-fake PASS)

1. In a **live** Codex session, call `workflow()` with absolute `cwd`
   (and a one-leaf script). This pack does not launch that call.
2. Bind `run_dir` to the exact absolute directory the tool returned.
3. Inspect fail-closed:

```bash
# from an Advisor checkout (not this pack)
sh plugins/sol-advisor/scripts/smoke-odw-one-leaf.sh \
  --host codex \
  --run-dir /absolute/.odw/<name>/runs/<runId>
```

`--run-dir` **must** be absolute. Do not auto-launch a run. Do not
invent `PASS`. Missing checkout, wrong ODW version, `compatible=false`,
or `agent_count != 1` is a failure.

Lane B live smoke: record `not run — Lane B awaiting Jay credentials`
until Jay credentials exist. Do not invent attestation.
