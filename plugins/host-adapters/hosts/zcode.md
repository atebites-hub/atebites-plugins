# ZCode seating recipe (SPIKE)

**Not production seating. Not a Factory default. Not a bot.**

ZCode is current seating pain. Follow these steps on the operator box.
This file does not run them. There is no Codex `/hooks` step on ZCode —
do not invent one.

Normative lock: [`docs/SPIKE-HOST-ADAPTERS.md`](../../../docs/SPIKE-HOST-ADAPTERS.md).
Catalog install commands live in the repo [README](../../../README.md).

## 1. Pin SHA

Same catalog pins as Codex. Do not float `main`. Do not bump pins from
this pack.

| Product | Pin to use |
| --- | --- |
| Superpowers | `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (v6.3.0) |
| ponytail | `4416c4dc06feef1541f446022670c04c3c014699` |
| Advisor | catalog `bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3` |
| ODW | `cc2be9b62cbe2fb48d7b6bd4d7453f1f4d45b2f0` |

```bash
git clone --recurse-submodules https://github.com/atebites-hub/atebites-plugins.git
# or:
git submodule update --init --recursive
```

Catalog Advisor pin `bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3` already
includes the ZCode `.plugins[]` matcher (Advisor
[#12](https://github.com/atebites-hub/advisor/pull/12), marketplace
[#22](https://github.com/atebites-hub/atebites-plugins/pull/22)) and
one-leaf launch-then `--run-dir` docs (Advisor
[#13](https://github.com/atebites-hub/advisor/pull/13), marketplace
[#25](https://github.com/atebites-hub/atebites-plugins/pull/25)). This
pack cites that pin; it does not bump the gitlink.

## 2. Install / enable Factory defaults

```text
/plugins marketplace add atebites-hub/atebites-plugins
```

```text
/plugins install open-dynamic-workflows
```

```text
/plugins install ponytail
```

```text
/plugins install advisor
```

```text
/plugins install superpowers
```

CLI equivalent used by Advisor:

```bash
zcode plugins marketplace add atebites-hub/atebites-plugins
zcode plugins install open-dynamic-workflows@atebites-plugins
zcode plugins install ponytail@atebites-plugins
zcode plugins install advisor@atebites-plugins
zcode plugins install superpowers@atebites-plugins
```

The Advisor package coordinate inside the pinned fork is still
`sol-advisor@sol-advisor`. Catalog slug is `advisor`.

Factory seats ponytail at intensity **full** always. Persist that default
(do not recommend lite):

```bash
export PONYTAIL_DEFAULT_MODE=full
```

or `~/.config/ponytail/config.json`:

```json
{ "defaultMode": "full" }
```

Confirm the session with `/ponytail full`.

Empty advisor/grunt model+effort in `~/.zcode/cli/config.json` is
`plugin_settings_required`. Write factory-sane settings with the packaged
helper (Advisor-owned; copied here, not invented):

```text
$advisor apply --host zcode
```

Or `$sol-advisor:advisor apply --host zcode`. Apply/configure merge only
Advisor plugin options; they do not rewrite host model or provider
credentials. Start a new session after changing settings.

## 3. `advisor doctor --host zcode`

Fail-closed. Doctor expects:

- canonical id **`open-dynamic-workflows@open-dynamic-workflows`**
- version **`0.3.0`**
- **enabled == true**

ZCode `plugins list --json` shape is **`.plugins[].id`** (with `version`,
`enabled`). Marketplace twin
`open-dynamic-workflows@atebites-plugins` **does not satisfy doctor alone**. Installing from this catalog is not enough if the list row is the twin id.

```text
$sol-advisor:advisor doctor --host zcode
```

or `$advisor doctor --host zcode`.

On catalog pin `bdcf8d5d…`, `odw_list_is_compatible` reads `.plugins[]`
with the same id/version/enabled mapping as Codex `.installed[]` /
`.installedPlugins[]`. Disabled rows and 0.2.0 stay incompatible.

Do not soft-pass `plugin_settings_required` or `compatible=false`. Do not
edit ODW or its installed cache to force a pass.

## 4. Hooks

ZCode has **no** Codex `/hooks` trust step. Do not add `--trust` or a
fake `/hooks` bypass. If a later ZCode host grows a trust UI, document it
then; do not invent it here.

## 5. Optional one-leaf (workflow MCP, then `--run-dir`)

Do **not** auto-launch. Operator launches a one-leaf ODW `workflow()`
first (workflow MCP or equivalent ZCode path), then:

```bash
sh plugins/sol-advisor/scripts/smoke-odw-one-leaf.sh \
  --host zcode \
  --run-dir /absolute/.odw/.../runs/run-ID
```

Stay fail-closed. Missing checkout, wrong version, `compatible=false`, or
a non-one-leaf run is a failure. This pack does not attest Lane B.

## Not claimed

Printing or exiting 0 from `scripts/print-recipe.sh` is **not** a seating
pass. Factory Harness bot is not this recipe.
