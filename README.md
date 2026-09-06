# atebites-plugins

Multi-host plugin marketplace for **atebites-hub**. Cursor Import from Repo only indexes **in-repo directories**, so this catalog vendors the plugins as git submodules (plus thin host wrappers where a repo is not already a Cursor plugin). Cursor, Grok, Codex, and ZCode use local path sources only. Claude Code uses GitHub plugin sources for the four forks because it clones this marketplace without initializing git submodules.

This catalog uses **atebites-hub forks**, not DietrichGebert / xz1220 / tcarac / imsai-sh originals, whenever a fork exists. J-Space has no atebites-hub fork; that one submodule is the upstream Apache-2.0 suite.

**Factory story (Jay 2026-09-05).** Superpowers is the factory-default pin: a pin-only submodule of [obra/superpowers](https://github.com/obra/superpowers) @ v6.3.0 (`b36e0829c6d0140e93cfef2ca599b1b07d4a7797`), not an atebites fork. Ponytail is **Factory-required** @ `911022dc`, intensity **full** always (never lite). Advisor is Factory @ `296cd0b9`. ODW is Factory-required @ `9708a77a` (hard fix for orphan nested SHA after D3-A; native alignment unproven until QA). Assistant will wire project-factory `enabledPlugins` for Superpowers and ponytail only.

**Discarded from Factory.** taskboard and j-space are the same class as CE: not Factory defaults, not wired into project-factory, discarded from the Factory story. Not optional defaults. Not factory-default candidates. Marketplace keeps their repos/submodules as catalog entries for optional install only. **CE** (Compound Engineering / `compound-engineering`) is discarded entirely: no default, no thin opt-in, no marketplace CE entry.

**Upcoming / P2 v1 warn-default (catalog-listed for pin install, not a Factory default).** `plugins/factory-policy/` is inline factory-policy (+ nested `memory-system`) to replace `reasoning-system` / `sequentialthinking`. It is catalog-listed for pin install as `factory-policy@atebites-plugins` (v1 warn-default; not a Factory default). Still **not** a Factory story kept-list plugin and **not** wired into project-factory `enabledPlugins` until QA fail-mode VERDICT. Checkers for C3.1–C3.3, C5, and C6 default to **warn** (fail via config). C7 is a warn stub. Do not treat a skipped hook as a pass. See [docs/POLICY-V1.md](docs/POLICY-V1.md).

**Upcoming / P2–P3 spike (not a catalog plugin, not a Factory default, not a bot).** `plugins/host-adapters/` is an inline SPIKE stub: docs+scripts for per-host install/seat of Factory defaults (Codex + ZCode first). It is **not** listed in host marketplaces, **not** factory-default, **not** wired into project-factory `enabledPlugins`, and **not** the Factory Harness bot (box installs/ops only). Scripts print `SPIKE stub` and do not seat, auto-trust, or attest. Rejected names: `factory-harness`, `factory-host-adapters`. See [docs/SPIKE-HOST-ADAPTERS.md](docs/SPIKE-HOST-ADAPTERS.md).

**Upcoming / P2 spike (not a catalog plugin, not a Factory default).** `plugins/linear-tracking/` is a vendored pin of [openai/skills](https://github.com/openai/skills) curated `linear` @ `49f948faa9258a0c61caceaf225e179651397431` plus Factory placement overlay. It replaces discarded `taskboard-workflow`. It is **not** listed in host marketplaces, **not** factory-default, and **not** wired into project-factory `enabledPlugins`. Do not invent Linear API secrets or soft-pass. Do not claim Linear Agent skills installed. See [docs/SPIKE-LINEAR-TRACKING.md](docs/SPIKE-LINEAR-TRACKING.md).

Which agent plugins belong here is defined by [PJTemplate `docs/agents/agent_stack.md`](https://github.com/atebites-hub/PJTemplate/blob/main/docs/agents/agent_stack.md). Factory defaults are the Jay 2026-09-05 lock above, not the older PJTemplate keep/strip optional stack.

| Plugin | Product | Source |
| --- | --- | --- |
| `open-dynamic-workflows` | Open Dynamic Workflows | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) (Factory-required @ `9708a77a`; native alignment unproven until QA) |
| `ponytail` | Ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) (**Factory-required** @ `911022dc`; intensity **full** always, never lite) |
| `advisor` | Advisor | [atebites-hub/advisor](https://github.com/atebites-hub/advisor) (Factory @ `296cd0b9`; renamed from `atebites-hub/sol-advisor`; parent [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor) unchanged) |
| `taskboard` | Taskboard | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) (upstream [tcarac/taskboard](https://github.com/tcarac/taskboard); catalog-only, **not** a Factory default) |
| `j-space` | J-Space | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) (Apache-2.0; no atebites-hub fork; catalog-only, **not** a Factory default) |
| `superpowers` | Superpowers | [obra/superpowers](https://github.com/obra/superpowers) @ v6.3.0 (`b36e0829c6d0140e93cfef2ca599b1b07d4a7797`; factory-default pin, not an atebites fork) |
| `factory-policy` | factory-policy | inline `plugins/factory-policy` @ `0.1.0` (v1 warn-default; catalog-listed for pin install as `factory-policy@atebites-plugins`; **not** a Factory default) |

Clone with submodules:

```bash
git clone --recurse-submodules https://github.com/atebites-hub/atebites-plugins.git
```

Already cloned?

```bash
git submodule update --init --recursive
```

## Cursor

Dashboard → **Plugins** → **Import from Repo** → paste:

```text
https://github.com/atebites-hub/atebites-plugins
```

Then install the Factory story plugins: **open-dynamic-workflows**, **ponytail**, **advisor**, **superpowers**. **taskboard** and **j-space** remain catalog entries for optional install only (not Factory defaults; not wired into project-factory). There is no CE plugin. The catalog slug was `sol-advisor` before the GitHub rename.

Cursor CLI (`agent`) does not install from this marketplace the way Grok/Codex do. Use each plugin's own installer or `--plugin-dir` after a submodule clone:

```bash
git clone --recurse-submodules https://github.com/atebites-hub/atebites-plugins.git
cd atebites-plugins

node plugins/open-dynamic-workflows/scripts/install-cursor-cli.mjs
agent mcp enable open-dynamic-workflows

agent --plugin-dir "$PWD/plugins/ponytail"

sh plugins/advisor/plugins/sol-advisor/scripts/install-cursor.sh
agent --plugin-dir "$HOME/.cursor/plugins/local/sol-advisor"

agent --plugin-dir "$PWD/plugins/taskboard"
agent --plugin-dir "$PWD/plugins/j-space"
agent --plugin-dir "$PWD/plugins/superpowers"
```

The install script still lives at `plugins/advisor/plugins/sol-advisor/scripts/install-cursor.sh` and still symlinks to `~/.cursor/plugins/local/sol-advisor` until the Advisor productize scrub lands. You can also clone [atebites-hub/advisor](https://github.com/atebites-hub/advisor) and point `--plugin-dir` at that checkout. Taskboard still needs the `taskboard` binary on `PATH` (`brew tap tcarac/taskboard && brew install taskboard` or `make build` in the fork).

## Grok Build

```bash
grok plugin marketplace add atebites-hub/atebites-plugins
grok plugin install open-dynamic-workflows --trust
grok plugin install ponytail --trust
grok plugin install advisor --trust
grok plugin install taskboard --trust
grok plugin install j-space --trust
grok plugin install superpowers --trust
```

Enable plugins that default to off (`/plugins`, or `enabled` in `~/.grok/config.toml`), then start a new session.

## Claude Code

Send these as **separate prompts** (marketplace add, refresh if already added, then each install):

```text
/plugin marketplace add atebites-hub/atebites-plugins
```

If this marketplace is already added, refresh it so the catalog plugins appear:

```text
/plugin marketplace update atebites-plugins
```

Or remove the marketplace and add it again. Then install any catalog plugin:

```text
/plugin install open-dynamic-workflows@atebites-plugins
```

```text
/plugin install ponytail@atebites-plugins
```

```text
/plugin install advisor@atebites-plugins
```

```text
/plugin install taskboard@atebites-plugins
```

```text
/plugin install j-space@atebites-plugins
```

```text
/plugin install superpowers@atebites-plugins
```

## Codex / ChatGPT Codex

```bash
codex plugin marketplace add atebites-hub/atebites-plugins
codex plugin add open-dynamic-workflows@atebites-plugins
codex plugin add ponytail@atebites-plugins
codex plugin add advisor@atebites-plugins
codex plugin add taskboard@atebites-plugins
codex plugin add j-space@atebites-plugins
codex plugin add superpowers@atebites-plugins
```

Open a new Codex thread. Trust lifecycle hooks from `/hooks` where a plugin ships them (ponytail, Advisor, Superpowers).

## ZCode

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
/plugins install taskboard
```

```text
/plugins install j-space
```

```text
/plugins install superpowers
```

CLI equivalent used by Advisor: `zcode plugins marketplace add atebites-hub/atebites-plugins` then `zcode plugins install advisor@atebites-plugins` if the host namespaces by marketplace name. The package coordinate inside the pinned fork is still `sol-advisor@sol-advisor` until the productize scrub.

## Hermes / Pi

Hermes and Pi install a **plugin git URL**. They do not consume this Cursor-style marketplace. Ponytail and Superpowers ship Hermes `plugin.yaml` and a Pi extension. Point Ponytail at the **atebites-hub fork**, not DietrichGebert; Superpowers is pin-only at obra/superpowers @ v6.3.0:

```bash
hermes plugins install atebites-hub/ponytail --enable
hermes plugins install obra/superpowers --enable
```

```text
pi install git:github.com/atebites-hub/ponytail
pi install git:github.com/obra/superpowers
```

Restart Hermes after installing. `open-dynamic-workflows`, Advisor, taskboard, and j-space do not ship Hermes/Pi marketplace manifests here. Use the Cursor/Grok/Claude/Codex/ZCode catalogs above, or install from the plugin repos listed in the table. taskboard and j-space are catalog-only (not Factory); CE is not in this marketplace.

## Not a plugin: CE

**CE** (Compound Engineering / `compound-engineering` / EveryInc) is discarded entirely from Factory and from this catalog (Jay 2026-09-05). No default, no thin opt-in, no marketplace CE entry. Do not add a CE product.

## Not a plugin: LLM-as-a-Verifier

Out of this marketplace. It scores how transcripts look (logprob preference); it cannot verify agent work with tests or binary gates. Do not add it to this marketplace.

| Piece | URL |
| --- | --- |
| Framework | https://github.com/llm-as-a-verifier/llm-as-a-verifier |
| TurboAgent proxy | https://github.com/llm-as-a-verifier/TurboAgent |

DSH-only ports are out of scope. Superpowers is the factory-default pin (obra/superpowers @ v6.3.0 / `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`). taskboard and j-space are catalog-only (discarded from Factory). CE is not in this marketplace.

## Layout

```text
.cursor-plugin/marketplace.json   # Cursor (official schema; local paths only)
.grok-plugin/marketplace.json     # Grok Build (`source: { type: "local", path }`)
.claude-plugin/marketplace.json   # Claude Code (GitHub plugin sources for forks + Superpowers pin; j-space local wrap)
.agents/plugins/marketplace.json  # Codex (local path sources)
marketplace.json                  # ZCode
plugins/open-dynamic-workflows/   # submodule: atebites-hub/open-dynamic-workflows-plugin
plugins/ponytail/                 # submodule: atebites-hub/ponytail
plugins/advisor/                  # submodule: atebites-hub/advisor (GitHub rename from sol-advisor)
plugins/taskboard/                # thin Cursor/Grok/Codex/ZCode wrap (catalog-only; not Factory)
plugins/taskboard/upstream/       # submodule: atebites-hub/taskboard (non-Factory catalog)
plugins/j-space/                  # thin multi-host wrap of the J-Space skill (catalog-only; not Factory)
plugins/j-space/vendor/j-space-cognition-suite/  # submodule: upstream Apache-2.0 suite (non-Factory catalog)
plugins/superpowers/              # submodule: obra/superpowers @ v6.3.0 (b36e082…; factory-default pin; no floating branch)
plugins/factory-policy/           # inline v1 warn-default (P2); catalog-listed for pin install; not a submodule; not factory-default
plugins/host-adapters/            # inline SPIKE stub (P2–P3); docs+scripts; not a bot; not a catalog plugin; not factory-default
plugins/linear-tracking/          # upcoming vendored pin (P2); not a catalog plugin; not factory-default
```

Cursor `source` for ODW is the nested package `plugins/open-dynamic-workflows/plugins/open-dynamic-workflows` (it has `.cursor-plugin/plugin.json`, skills, and MCP). Grok uses that same nested package because Grok rejected `source: "./"` on the ODW repo. Codex/ZCode ODW sources are the submodule root, which already has those hosts' manifests.

Advisor checkout path is `plugins/advisor` (GitHub repo `atebites-hub/advisor`). Codex still points at the nested package `plugins/advisor/plugins/sol-advisor`; Cursor/Grok/ZCode use the submodule root. Catalog name is `advisor`. The pinned fork's `plugin.json` name and package coordinate remain `sol-advisor` until productize.

Claude Code does not use those local paths for submodule plugins. `/plugin marketplace add` clones this catalog without initializing git submodules, so gitlink directories have no `.claude-plugin/plugin.json`. The Claude catalog therefore uses GitHub plugin sources for ODW, ponytail, Advisor, and taskboard (`source: { "source": "github", "repo": "atebites-hub/..." }`), pointing at each fork root rather than a nested package. Superpowers uses `obra/superpowers` with `ref: v6.3.0` and SHA `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` so Claude does not float on `main`. j-space and factory-policy stay in-repo wraps (`./plugins/j-space`, `./plugins/factory-policy`); there is no separate atebites-hub plugin repo for either. Cursor, Grok, Codex, and ZCode stay local-path-only and use the wrap at `plugins/taskboard`, which points skills at `upstream/skills` and does not rewrite the Go binary.

J-Space plugin manifests in this repo only expose the existing `j-space/SKILL.md` tree.

## Fork maintenance

Submodule and nested-fork status: [docs/FORK-INDEX.md](docs/FORK-INDEX.md). Binding policy: [docs/FORK-MAINTENANCE.md](docs/FORK-MAINTENANCE.md).

## Licenses

This catalog is MIT. Submodule plugins keep their own licenses (MIT for ODW, ponytail, Advisor, taskboard, and Superpowers; Apache-2.0 for J-Space — see `plugins/j-space/NOTICE`). The linear-tracking vendor pin is Apache-2.0 (openai/skills curated `linear` — see `plugins/linear-tracking/NOTICE`).

## Validate

```bash
npm install
npm test
```
