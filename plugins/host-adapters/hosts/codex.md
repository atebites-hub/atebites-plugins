# Codex seating recipe (SPIKE)

**Not production seating. Not a Factory default. Not a bot.**

Codex / ChatGPT Codex is current seating pain. Follow these steps on the
operator box. This file does not run them. Scripts that print this recipe
must not pass `--trust` or write trusted hook state.

Normative lock: [`docs/SPIKE-HOST-ADAPTERS.md`](../../../docs/SPIKE-HOST-ADAPTERS.md).
Catalog install commands for the six marketplace plugins live in the repo
[README](../../../README.md). This recipe adds the seating checks those
commands do not cover.

## 1. Pin SHA

Use the marketplace pins already recorded in
[`docs/FORK-INDEX.md`](../../../docs/FORK-INDEX.md). Do not float `main`.
Do not bump pins from this pack.

| Product | Pin to use |
| --- | --- |
| Superpowers | `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (v6.3.0) |
| ponytail | `911022dc1fb868b42e006c1848aaf16b0867de2f` |
| Advisor | catalog `bdcf8d5d226e2bf5448f43fb09f87d0d089dc7e3` |
| ODW | `9708a77aebe1b0b06b20150d5f799e4a28e5a14a` |

Clone this catalog with submodules so those gitlinks resolve:

```bash
git clone --recurse-submodules https://github.com/atebites-hub/atebites-plugins.git
# or, already cloned:
git submodule update --init --recursive
```

## 2. Install / enable Factory defaults

```bash
codex plugin marketplace add atebites-hub/atebites-plugins
codex plugin add open-dynamic-workflows@atebites-plugins
codex plugin add ponytail@atebites-plugins
codex plugin add advisor@atebites-plugins
codex plugin add superpowers@atebites-plugins
```

Open a **new** Codex thread after install. Enabling in the catalog is not
the same as doctor-compatible ODW (see step 3).

Factory seats ponytail at intensity **full** always. Persist that default
(do not recommend lite):

```bash
export PONYTAIL_DEFAULT_MODE=full
```

or `~/.config/ponytail/config.json`:

```json
{ "defaultMode": "full" }
```

Confirm the session with `@ponytail full` or `/ponytail full`.

Advisor's own Codex coordinate remains `sol-advisor@sol-advisor` inside the
pinned fork. The catalog slug is `advisor`. Use whichever the host actually
installed; doctor still keys ODW on the **canonical** ODW id, not the
Advisor slug.

## 3. `advisor doctor --host codex`

Fail-closed. Doctor expects:

- `open-dynamic-workflows@open-dynamic-workflows` at **0.3.0**
- installed **and** enabled

The marketplace twin `open-dynamic-workflows@atebites-plugins` **does not satisfy doctor alone**. A marketplace `package.json` at 0.3.0 is not enough. If `checks.odwPlugin.compatible` is false, install/enable the canonical id at 0.3.0. Do not edit ODW or its cache to force a pass.

```text
$advisor doctor --host codex
```

Do not soft-pass `plugin_settings_required` or `compatible=false`.

## 4. Codex `/hooks` trust (user-gated; no bypass)

Ponytail, Advisor, and Superpowers ship lifecycle hooks. In the Codex
thread, open **`/hooks`**, review each hook, and trust only what you
intend.

- Operator-gated. No script in this pack may pass `--trust` or write
  trusted hook state.
- Plugin install does not imply trust.
- Skip or refuse is a valid outcome; do not invent a bypass.

Then re-run `$advisor doctor --host codex` if Advisor asked for hook trust
before seating.

## 5. Optional one-leaf (workflow MCP, then `--run-dir`)

Do **not** auto-launch. Operator launches a one-leaf ODW `workflow()`
first (workflow MCP or equivalent Codex path), then points Advisor smoke
at that run:

```bash
sh plugins/sol-advisor/scripts/smoke-odw-one-leaf.sh \
  --host codex \
  --run-dir /absolute/.odw/.../runs/run-ID
```

(`plugins/sol-advisor/` is inside the Advisor checkout / marketplace
nested package.) Missing checkout, wrong version, `compatible=false`, or a
non-one-leaf run is a **failure**. This pack does not attest Lane B.

## Not claimed

Printing or exiting 0 from `scripts/print-recipe.sh` is **not** a seating
pass. Factory Harness bot is not this recipe.
