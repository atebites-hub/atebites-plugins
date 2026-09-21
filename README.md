# atebites-plugins

Multi-host plugin marketplace for **atebites-hub**. Cursor Import from Repo only indexes **in-repo directories**, so this catalog vendors the plugins as git submodules (plus thin host wrappers where a repo is not already a Cursor plugin). Cursor, Grok, Codex, and ZCode use local path sources only. Claude Code uses GitHub plugin sources for the four forks because it clones this marketplace without initializing git submodules.

This catalog uses **atebites-hub forks**, not DietrichGebert / xz1220 / tcarac / imsai-sh originals, whenever a fork exists. J-Space has no atebites-hub fork; that one submodule is the upstream Apache-2.0 suite.

**Factory story (Jay 2026-09-05).** Superpowers is the factory-default pin: a pin-only submodule of [obra/superpowers](https://github.com/obra/superpowers) @ v6.3.0 (`b36e0829c6d0140e93cfef2ca599b1b07d4a7797`), not an atebites fork. Ponytail is **Factory-required** @ `4416c4dc` (fork [#5](https://github.com/atebites-hub/ponytail/pull/5) Retriever docs sync; matches tip), intensity **full** always (never lite). Advisor is Factory @ `296cd0b9`. ODW and the custom ZCode CLI are retired (2026-09-21); native-orchestration is the skill-only replacement. Project Factory currently enables Superpowers, ponytail, and its warn-default factory-policy template pin; Advisor remains intended but are not enabled in the seed.

**Discarded from Factory.** taskboard and j-space are the same class as CE: not Factory defaults, not wired into project-factory, discarded from the Factory story. Not optional defaults. Not factory-default candidates. Taskboard is also removed from the marketplace as of 2026-09-21. J-Space remains an optional catalog entry only. **CE** (Compound Engineering / `compound-engineering`) is discarded entirely: no default, no thin opt-in, no marketplace CE entry.

**Upcoming / P2 v1 warn-default (catalog-listed for pin install, not a Factory default).** `plugins/factory-policy/` is inline factory-policy (+ nested `memory-system`) to replace `reasoning-system` / `sequentialthinking`. It is catalog-listed for pin install as `factory-policy@atebites-plugins` (v1 warn-default; not a Factory default). Project Factory explicitly seats it in `enabledPlugins` as a warn-default template pin. That seating is not a Factory-wide fail-mode VERDICT or kept-list promotion. Checkers for C3.1–C3.3, C5, and C6 default to **warn** (fail via config). C7 is a warn stub. Do not treat a skipped hook as a pass. See [docs/POLICY-V1.md](docs/POLICY-V1.md).

**Upcoming / P2–P3 spike (not a catalog plugin, not a Factory default, not a bot).** `plugins/host-adapters/` is an inline SPIKE stub: docs+scripts for per-host install/seat of Factory defaults (Codex + ZCode first). It is **not** listed in host marketplaces, **not** factory-default, **not** wired into project-factory `enabledPlugins`, and **not** the Factory Harness bot (box installs/ops only). Scripts print `SPIKE stub` and do not seat, auto-trust, or attest. Rejected names: `factory-harness`, `factory-host-adapters`. See [docs/SPIKE-HOST-ADAPTERS.md](docs/SPIKE-HOST-ADAPTERS.md).

**Upcoming / P2 spike (not a catalog plugin, not a Factory default).** `plugins/linear-tracking/` is an **interim** vendored skill body of [openai/skills](https://github.com/openai/skills) curated `linear` @ `49f948faa9258a0c61caceaf225e179651397431` plus Factory placement overlay. Status **P N** — not Superpowers-class; openai/skills is deprecated; replace when a standalone OSI-licensed plugin appears. It replaces discarded `taskboard-workflow`. It is **not** listed in host marketplaces, **not** factory-default, and **not** wired into project-factory `enabledPlugins`. Do not invent Linear API secrets or soft-pass. Do not claim Linear Agent skills installed. See [docs/SPIKE-LINEAR-TRACKING.md](docs/SPIKE-LINEAR-TRACKING.md).

**Upcoming / P2 spike (catalog-listed for pin install, not a Factory default).** `plugins/gitnexus/` is a thin MCP wrap of npm `gitnexus@1.6.7` (same command shape as the project-factory template `.mcp.json`). It is catalog-listed for pin install as `gitnexus@atebites-plugins`. Still **not** a Factory story kept-list plugin and **not** wired into project-factory `enabledPlugins`. Assistant owns later template `.mcp.json` replacement. Latest npm stable observed 2026-09-06 is `1.6.11` — pin stays `1.6.7`. Not a full atebites-hub fork. Do not soft-pass missing MCP or claim Lane B. See [docs/SPIKE-GITNEXUS.md](docs/SPIKE-GITNEXUS.md).

Which agent plugins belong here is defined by [PJTemplate `docs/agents/agent_stack.md`](https://github.com/atebites-hub/PJTemplate/blob/main/docs/agents/agent_stack.md). Factory defaults are the Jay 2026-09-05 lock above, not the older PJTemplate keep/strip optional stack.

| Plugin | Product | Source |
| --- | --- | --- |
| `native-orchestration` | Inline skill-only native host routing | No workflow runtime or custom CLI |
| `ponytail` | Ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) (**Factory-required** @ `4416c4dc` after [#5](https://github.com/atebites-hub/ponytail/pull/5); intensity **full** always, never lite) |
| `advisor` | Advisor | [atebites-hub/advisor](https://github.com/atebites-hub/advisor) (Factory @ `296cd0b9`; renamed from `atebites-hub/sol-advisor`; parent [DannyMac180/sol-advisor](https://github.com/DannyMac180/sol-advisor) unchanged) |
| `j-space` | J-Space | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) (Apache-2.0; no atebites-hub fork; catalog-only, **not** a Factory default) |
| `superpowers` | Superpowers | [obra/superpowers](https://github.com/obra/superpowers) @ v6.3.0 (`b36e0829c6d0140e93cfef2ca599b1b07d4a7797`; factory-default pin, not an atebites fork) |
| `factory-policy` | factory-policy | inline `plugins/factory-policy` @ `0.1.0` (v1 warn-default; catalog-listed for pin install as `factory-policy@atebites-plugins`; **not** a Factory default) |
| `gitnexus` | GitNexus wrap | inline `plugins/gitnexus` @ `0.1.0` (Upcoming / P N; catalog-listed for pin install as `gitnexus@atebites-plugins`; pins `gitnexus@1.6.7`; **not** a Factory default) |

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

Use **native-orchestration**, **ponytail**, **advisor**, and **superpowers** as appropriate. Taskboard and ODW are retired; **j-space** remains optional and outside Factory defaults. There is no CE plugin. The catalog slug was `sol-advisor` before the GitHub rename.

Cursor CLI (`agent`) does not install from this marketplace the way Grok/Codex do. Use each plugin's own installer or `--plugin-dir` after a submodule clone:

```bash
git clone --recurse-submodules https://github.com/atebites-hub/atebites-plugins.git
cd atebites-plugins

agent --plugin-dir "$PWD/plugins/native-orchestration"

agent --plugin-dir "$PWD/plugins/ponytail"

sh plugins/advisor/plugins/sol-advisor/scripts/install-cursor.sh
agent --plugin-dir "$HOME/.cursor/plugins/local/sol-advisor"

agent --plugin-dir "$PWD/plugins/j-space"
agent --plugin-dir "$PWD/plugins/superpowers"
```

The install script still lives at `plugins/advisor/plugins/sol-advisor/scripts/install-cursor.sh` and still symlinks to `~/.cursor/plugins/local/sol-advisor` until the Advisor productize scrub lands. You can also clone [atebites-hub/advisor](https://github.com/atebites-hub/advisor) and point `--plugin-dir` at that checkout.

## Grok Build

```bash
grok plugin marketplace add atebites-hub/atebites-plugins
grok plugin install native-orchestration --trust
grok plugin install ponytail --trust
grok plugin install advisor --trust
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
/plugin install native-orchestration@atebites-plugins
```

```text
/plugin install ponytail@atebites-plugins
```

```text
/plugin install advisor@atebites-plugins
```

```text
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
codex plugin add native-orchestration@atebites-plugins
codex plugin add ponytail@atebites-plugins
codex plugin add advisor@atebites-plugins
codex plugin add j-space@atebites-plugins
codex plugin add superpowers@atebites-plugins
```

Open a new Codex thread. Trust lifecycle hooks from `/hooks` where a plugin ships them (ponytail, Advisor, Superpowers).

## ZCode

```text
/plugins marketplace add atebites-hub/atebites-plugins
```

```text
/plugins install native-orchestration
```

```text
/plugins install ponytail
```

```text
/plugins install advisor
```

```text
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

Restart Hermes after installing. Advisor, j-space, and gitnexus do not ship Hermes/Pi marketplace manifests here. Use the Cursor/Grok/Claude/Codex/ZCode catalogs above, or install from the plugin repos listed in the table. Taskboard is retired; j-space is catalog-only (not Factory); gitnexus is catalog-listed for pin install only (Upcoming / P N; not Factory); CE is not in this marketplace.

## Not a plugin: CE

**CE** (Compound Engineering / `compound-engineering` / EveryInc) is discarded entirely from Factory and from this catalog (Jay 2026-09-05). No default, no thin opt-in, no marketplace CE entry. Do not add a CE product.

## Not a plugin: LLM-as-a-Verifier

Out of this marketplace. It scores how transcripts look (logprob preference); it cannot verify agent work with tests or binary gates. Do not add it to this marketplace.

| Piece | URL |
| --- | --- |
| Framework | https://github.com/llm-as-a-verifier/llm-as-a-verifier |
| TurboAgent proxy | https://github.com/llm-as-a-verifier/TurboAgent |

DSH-only ports are out of scope. Superpowers is the factory-default pin (obra/superpowers @ v6.3.0 / `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`). Taskboard is retired; j-space is catalog-only (discarded from Factory). CE is not in this marketplace.

## Layout

```text
.cursor-plugin/marketplace.json   # Cursor (official schema; local paths only)
.grok-plugin/marketplace.json     # Grok Build (`source: { type: "local", path }`)
.claude-plugin/marketplace.json   # Claude Code (GitHub plugin sources for forks + Superpowers pin; j-space local wrap)
.agents/plugins/marketplace.json  # Codex (local path sources)
marketplace.json                  # ZCode
plugins/native-orchestration/   # inline skill-only native routing
plugins/ponytail/                 # submodule: atebites-hub/ponytail
plugins/advisor/                  # submodule: atebites-hub/advisor (GitHub rename from sol-advisor)
plugins/j-space/                  # thin multi-host wrap of the J-Space skill (catalog-only; not Factory)
plugins/j-space/vendor/j-space-cognition-suite/  # submodule: upstream Apache-2.0 suite (non-Factory catalog)
plugins/superpowers/              # submodule: obra/superpowers @ v6.3.0 (b36e082…; factory-default pin; no floating branch)
plugins/factory-policy/           # inline v1 warn-default (P2); catalog-listed for pin install; not a submodule; not factory-default
plugins/host-adapters/            # inline SPIKE stub (P2–P3); docs+scripts; not a bot; not a catalog plugin; not factory-default
plugins/linear-tracking/          # upcoming vendored pin (P2); not a catalog plugin; not factory-default
plugins/gitnexus/                 # upcoming thin MCP wrap (P2); catalog-listed for pin install; pins gitnexus@1.6.7; not factory-default
```


Advisor checkout path is `plugins/advisor` (GitHub repo `atebites-hub/advisor`). Codex still points at the nested package `plugins/advisor/plugins/sol-advisor`; Cursor/Grok/ZCode use the submodule root. Catalog name is `advisor`. The pinned fork's `plugin.json` name and package coordinate remain `sol-advisor` until productize.

Claude Code does not use those local paths for submodule plugins. `/plugin marketplace add` clones this catalog without initializing git submodules, so gitlink directories have no `.claude-plugin/plugin.json`. The Claude catalog therefore uses GitHub plugin sources for ponytail and Advisor (`source: { "source": "github", "repo": "atebites-hub/..." }`), pointing at each fork root rather than a nested package. Superpowers uses `obra/superpowers` with `ref: v6.3.0` and SHA `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` so Claude does not float on `main`. j-space, factory-policy, and gitnexus stay in-repo wraps (`./plugins/j-space`, `./plugins/factory-policy`, `./plugins/gitnexus`); there is no separate atebites-hub plugin repo for those three. Cursor, Grok, Codex, and ZCode stay local-path-only.

J-Space plugin manifests in this repo only expose the existing `j-space/SKILL.md` tree.

## Fork maintenance

Submodule and nested-fork status: [docs/FORK-INDEX.md](docs/FORK-INDEX.md). Binding policy: [docs/FORK-MAINTENANCE.md](docs/FORK-MAINTENANCE.md).

## Licenses

This catalog is MIT. Submodule plugins keep their own licenses (MIT for ponytail, Advisor, and Superpowers; Apache-2.0 for J-Space — see `plugins/j-space/NOTICE`). The linear-tracking vendor pin is Apache-2.0 (openai/skills curated `linear` — see `plugins/linear-tracking/NOTICE`). The gitnexus wrap manifests are MIT; the spawned npm package `gitnexus@1.6.7` is PolyForm-Noncommercial-1.0.0 (see `plugins/gitnexus/NOTICE`).

## Impeccable design guidance

`impeccable` is now a skill-only catalog package, pinned to upstream
`pbakaus/impeccable` `skill-v4.1.0` / `2c33196c51ac52e47691384e61d89f1218d8d21d`.
It includes the Apache-2.0 license, unchanged skill resources and a checked file
hash inventory. It registers no automatic hooks or MCP server. The template's
locked Impeccable detector remains separate from this guidance package.

Claude: `/plugin install impeccable@atebites-plugins`. Codex uses the catalog
entry; Cursor/Grok/ZCode use the same in-repo package. Refresh the existing
marketplace before installation. Package/schema/context-loader smoke does not
claim full live activation in every harness.

## Validate the catalog

```bash
npm install
npm test
```

## Native orchestration replaces ODW

`native-orchestration` is a skill-only package. It routes to the current host's
native facilities, explicitly including Antigravity 2.0 and Antigravity CLI.
It has no MCP server, runtime, CLI dependency, automatic hooks, or cross-host
executor. ODW and the atebites-hub/kingsword09 ZCode CLI are retired; old release
and QA notes remain historical evidence, not installation instructions.

Use official ZCode Desktop for its native `/workflow`. Its bundled headless CLI
and the source-built official CLI are distinct distributions; a missing TUI or
login failure is a vendor/runtime blocker, not a reason to resurrect the fork.
The 150% Coding Plan allowance has not been verified for standalone CLI use.
