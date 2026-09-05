# ZCode seating recipe (SPIKE)

**Host:** ZCode (maintained atebites-hub fork).
**Not** a Factory default pack. **Not** a bot. **Not** Lane B.
Print/help: `bash plugins/host-adapters/scripts/print-recipe.sh --host zcode`

Spine: **pin SHA → install/enable → `advisor doctor --host zcode`**.

Prefer native Agent with persisted `lite` attestation. ODW must still
align (compose with that attestation; use ODW for scaled/rerunnable
inspector-accepted work). Alignment is unproven until QA.

## 1. Pin SHA (do not bump from this pack)

| Plugin | Catalog pin |
| --- | --- |
| Superpowers | `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (v6.3.0) |
| ponytail | `911022dc1fb868b42e006c1848aaf16b0867de2f` |
| Advisor | `39bc5f1d6ce31265f0667f4c11d0b66a4fe38544` |
| ODW | `9708a77aebe1b0b06b20150d5f799e4a28e5a14a` (product **0.3.0**) |

Advisor **tip** `8fc0bcf017fc19559e0117a47be5dec2558ed43a` (PR #12) is
the doctor that reads ZCode `.plugins[].id`. Cite it. Do **not** bump
the catalog gitlink from this pack.

Do not add CE, taskboard, or j-space. Do not seat factory-policy
(Upcoming / P2 only).

## 2. Install / enable

```text
/plugins marketplace add atebites-hub/atebites-plugins
```

```text
/plugins install superpowers
```

```text
/plugins install ponytail
```

```text
/plugins install advisor
```

CLI equivalent:

```bash
zcode plugins marketplace add atebites-hub/atebites-plugins
zcode plugins install superpowers@atebites-plugins
zcode plugins install ponytail@atebites-plugins
zcode plugins install advisor@atebites-plugins
```

ODW **canonical** id (required for doctor). Install from the ODW plugin
marketplace (or any source that yields this id), then enable:

```text
/plugins marketplace add atebites-hub/open-dynamic-workflows-plugin
```

```text
/plugins install open-dynamic-workflows
```

```bash
zcode plugins marketplace add atebites-hub/open-dynamic-workflows-plugin
zcode plugins install open-dynamic-workflows@open-dynamic-workflows
```

Marketplace twin `open-dynamic-workflows@atebites-plugins` is **optional**
and does **not** satisfy doctor.

Start a **new** ZCode session after install or settings changes.
`$sol-advisor:advisor` is the ZCode skill name for the Advisor helper.

## 3. ZCode doctor reads `.plugins[].id`

ZCode `plugins list --json` looks like:

```json
{
  "plugins": [
    {
      "id": "open-dynamic-workflows@open-dynamic-workflows",
      "version": "0.3.0",
      "enabled": true
    }
  ]
}
```

Doctor must match `.plugins[].id` (and version/enabled). A matcher that
only reads Codex `.installed[]` / `.installedPlugins[]` is the old bug
(fixed on advisor tip `8fc0bcf0`, PR #12). Marketplace pin stays
`39bc5f1d` until a **separate** pin PR.

## 4. Advisor apply, then doctor

Empty advisor/grunt model+effort in `~/.zcode/cli/config.json` is
`plugin_settings_required`:

```text
$advisor apply --host zcode
$advisor doctor --host zcode
```

Or `$sol-advisor:advisor doctor --host zcode`.
`configure --host zcode --advisor-model …` writes any catalog-backed pair.
Apply/configure merge Advisor plugin options only — they do not rewrite
host model or provider credentials.

`odwPlugin.compatible=true` requires canonical
`open-dynamic-workflows@open-dynamic-workflows` at **0.3.0**, enabled.
`package.json` at 0.3.0 is not enough.

## 5. One-leaf (session-gated — no auto-fake PASS)

1. In a **live** ZCode session, call `workflow()` with absolute `cwd`.
   This pack does not launch that call.
2. Inspect fail-closed with an **absolute** run directory:

```bash
# from an Advisor checkout (not this pack)
sh plugins/sol-advisor/scripts/smoke-odw-one-leaf.sh \
  --host zcode \
  --run-dir /absolute/.odw/<name>/runs/<runId>
```

Do not auto-launch. Do not invent `PASS`. Missing checkout, wrong
version, `compatible=false`, or a non-one-leaf run is a failure.

Lane B live smoke: record `not run — Lane B awaiting Jay credentials`
until Jay credentials exist. Do not invent attestation.
