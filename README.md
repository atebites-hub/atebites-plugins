# atebites-plugins

Multi-host plugin marketplace for **atebites-hub**. Cursor Import from Repo only indexes **in-repo directories**, so this catalog vendors the plugins as git submodules (plus thin host wrappers where a repo is not already a Cursor plugin). Cursor, Grok, Codex, and ZCode use local path sources only. Claude Code uses GitHub plugin sources for the four forks because it clones this marketplace without initializing git submodules.

This catalog uses **atebites-hub forks**, not DietrichGebert / xz1220 / tcarac / imsai-sh originals, whenever a fork exists. J-Space has no atebites-hub fork; that one submodule is the upstream Apache-2.0 suite.

Which agent plugins belong here is defined by [PJTemplate `docs/agents/agent_stack.md`](https://github.com/atebites-hub/PJTemplate/blob/main/docs/agents/agent_stack.md).

| Plugin | Product | Source |
| --- | --- | --- |
| `open-dynamic-workflows` | Open Dynamic Workflows | [atebites-hub/open-dynamic-workflows-plugin](https://github.com/atebites-hub/open-dynamic-workflows-plugin) |
| `ponytail` | Ponytail | [atebites-hub/ponytail](https://github.com/atebites-hub/ponytail) |
| `sol-advisor` | Advisor | [atebites-hub/sol-advisor](https://github.com/atebites-hub/sol-advisor) |
| `taskboard` | Taskboard | [atebites-hub/taskboard](https://github.com/atebites-hub/taskboard) (upstream [tcarac/taskboard](https://github.com/tcarac/taskboard)) |
| `j-space` | J-Space | [Tiger3807861189/J-Space-Cognition-Suite-V3.6](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6) (Apache-2.0; no atebites-hub fork) |

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

Then install all five: **open-dynamic-workflows**, **ponytail**, **sol-advisor** (Advisor), **taskboard**, **j-space**.

Cursor CLI (`agent`) does not install from this marketplace the way Grok/Codex do. Use each plugin's own installer or `--plugin-dir` after a submodule clone:

```bash
git clone --recurse-submodules https://github.com/atebites-hub/atebites-plugins.git
cd atebites-plugins

node plugins/open-dynamic-workflows/scripts/install-cursor-cli.mjs
agent mcp enable open-dynamic-workflows

agent --plugin-dir "$PWD/plugins/ponytail"

sh plugins/sol-advisor/plugins/sol-advisor/scripts/install-cursor.sh
agent --plugin-dir "$HOME/.cursor/plugins/local/sol-advisor"

agent --plugin-dir "$PWD/plugins/taskboard"
agent --plugin-dir "$PWD/plugins/j-space"
```

You can also clone an individual fork and point `--plugin-dir` at that checkout. Taskboard still needs the `taskboard` binary on `PATH` (`brew tap tcarac/taskboard && brew install taskboard` or `make build` in the fork).

## Grok Build

```bash
grok plugin marketplace add atebites-hub/atebites-plugins
grok plugin install open-dynamic-workflows --trust
grok plugin install ponytail --trust
grok plugin install sol-advisor --trust
grok plugin install taskboard --trust
grok plugin install j-space --trust
```

Enable plugins that default to off (`/plugins`, or `enabled` in `~/.grok/config.toml`), then start a new session.

## Claude Code

Send these as **separate prompts** (marketplace add, refresh if already added, then each install):

```text
/plugin marketplace add atebites-hub/atebites-plugins
```

If this marketplace is already added, refresh it so all five plugins appear:

```text
/plugin marketplace update atebites-plugins
```

Or remove the marketplace and add it again. Then install any of the five:

```text
/plugin install open-dynamic-workflows@atebites-plugins
```

```text
/plugin install ponytail@atebites-plugins
```

```text
/plugin install sol-advisor@atebites-plugins
```

```text
/plugin install taskboard@atebites-plugins
```

```text
/plugin install j-space@atebites-plugins
```

## Codex / ChatGPT Codex

```bash
codex plugin marketplace add atebites-hub/atebites-plugins
codex plugin add open-dynamic-workflows@atebites-plugins
codex plugin add ponytail@atebites-plugins
codex plugin add sol-advisor@atebites-plugins
codex plugin add taskboard@atebites-plugins
codex plugin add j-space@atebites-plugins
```

Open a new Codex thread. Trust lifecycle hooks from `/hooks` where a plugin ships them (ponytail, Advisor).

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
/plugins install sol-advisor
```

```text
/plugins install taskboard
```

```text
/plugins install j-space
```

CLI equivalent used by Advisor: `zcode plugins marketplace add atebites-hub/atebites-plugins` then `zcode plugins install sol-advisor@sol-advisor` (coordinate stays `sol-advisor@sol-advisor` inside that plugin). From this catalog, install `sol-advisor@atebites-plugins` if the host namespaces by marketplace name.

## Hermes / Pi

Hermes and Pi install a **plugin git URL**. They do not consume this Cursor-style marketplace. Ponytail is the plugin in this catalog that already ships Hermes `plugin.yaml` and a Pi extension — point those hosts at the **atebites-hub fork**, not DietrichGebert:

```bash
hermes plugins install atebites-hub/ponytail --enable
```

```text
pi install git:github.com/atebites-hub/ponytail
```

Restart Hermes after installing. `open-dynamic-workflows`, Advisor, taskboard, and j-space do not ship Hermes/Pi marketplace manifests here. Use the Cursor/Grok/Claude/Codex/ZCode catalogs above, or install from the plugin repos listed in the table.

## Not a plugin: LLM-as-a-Verifier

Out of this marketplace. It scores how transcripts look (logprob preference); it cannot verify agent work with tests or binary gates. Do not add it to this marketplace.

| Piece | URL |
| --- | --- |
| Framework | https://github.com/llm-as-a-verifier/llm-as-a-verifier |
| TurboAgent proxy | https://github.com/llm-as-a-verifier/TurboAgent |

DSH-only ports are out of scope. compound-engineering and superpowers stay documented in PJTemplate; they are not vendored here.

## Layout

```text
.cursor-plugin/marketplace.json   # Cursor (official schema; local paths only)
.grok-plugin/marketplace.json     # Grok Build (`source: { type: "local", path }`)
.claude-plugin/marketplace.json   # Claude Code (GitHub plugin sources for forks; j-space local wrap)
.agents/plugins/marketplace.json  # Codex (local path sources)
marketplace.json                  # ZCode
plugins/open-dynamic-workflows/   # submodule: atebites-hub/open-dynamic-workflows-plugin
plugins/ponytail/                 # submodule: atebites-hub/ponytail
plugins/sol-advisor/              # submodule: atebites-hub/sol-advisor
plugins/taskboard/                # thin Cursor/Grok/Codex/ZCode wrap
plugins/taskboard/upstream/       # submodule: atebites-hub/taskboard
plugins/j-space/                  # thin multi-host wrap of the J-Space skill
plugins/j-space/vendor/j-space-cognition-suite/  # submodule: upstream Apache-2.0 suite
```

Cursor `source` for ODW is the nested package `plugins/open-dynamic-workflows/plugins/open-dynamic-workflows` (it has `.cursor-plugin/plugin.json`, skills, and MCP). Grok uses that same nested package because Grok rejected `source: "./"` on the ODW repo. Codex/ZCode ODW sources are the submodule root, which already has those hosts' manifests.

Claude Code does not use those local paths. `/plugin marketplace add` clones this catalog without initializing git submodules, so gitlink directories have no `.claude-plugin/plugin.json`. The Claude catalog therefore uses GitHub plugin sources for ODW, ponytail, Advisor, and taskboard (`source: { "source": "github", "repo": "atebites-hub/..." }`), pointing at each fork root rather than a nested package. j-space stays an in-repo wrap (`./plugins/j-space`); there is no atebites-hub/j-space plugin repo. Cursor, Grok, Codex, and ZCode stay local-path-only and use the wrap at `plugins/taskboard`, which points skills at `upstream/skills` and does not rewrite the Go binary.

J-Space plugin manifests in this repo only expose the existing `j-space/SKILL.md` tree.

## Licenses

This catalog is MIT. Submodule plugins keep their own licenses (MIT for ODW, ponytail, Advisor, and taskboard; Apache-2.0 for J-Space — see `plugins/j-space/NOTICE`).

## Validate

```bash
npm install
npm test
```
