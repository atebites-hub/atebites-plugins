# LLM-as-a-Verifier (marketplace wrap)

This directory is a **host plugin wrap** of the Python library
[`llm-verifier`](https://github.com/llm-as-a-verifier/llm-as-a-verifier).
It is **not an upstream Cursor or Claude marketplace plugin**. Upstream is
`pip install llm-verifier` (`llm_verifier.select` / `.compare` / `.track`).

The official Claude Code integration is **TurboAgent**, an API **proxy**:
https://github.com/llm-as-a-verifier/TurboAgent

```bash
pip install turbo-agent
turbo-agent
ANTHROPIC_BASE_URL=http://localhost:8888 claude
```

Cursor, Grok, Codex, ZCode, and Claude-with-MCP use **this catalog plugin's
skill + MCP**. Claude can use TurboAgent instead of (or in addition to) the
MCP. Default is skill + MCP only — **no hooks**. Do not add always-on session
or stop hooks that score every turn; verifier cost compounds.

This wrap does **not** git-submodule the framework. Upstream `data/` is a
~350MB SWE-bench / Terminal-Bench dump; `git clone --recurse-submodules`
must not pull it.

## Install from atebites-plugins

Catalog name: `llm-as-a-verifier`. Local source: `plugins/llm-as-a-verifier`.

Then:

```bash
pip install llm-verifier
# set one of: DEEPSEEK_API_KEY, VERTEX_API_KEY, OPENAI_BASE_URL
```

## MCP

Stdio server: `mcp/server.py`. Tools call the published Python API and do
**not** reimplement PPT.

| Tool | Python |
|------|--------|
| `select` | `llm_verifier.select` |
| `compare` | `llm_verifier.compare` |
| `track` | `llm_verifier.track` |

Missing `llm-verifier` or missing API key returns `isError` with install/key
instructions. Do not invent scores. Not Advisor evidence.

Host MCP files match Open Dynamic Workflows:

| Host | Config |
|------|--------|
| Cursor | `mcp.json` (`${PLUGIN_ROOT}`) |
| Grok | `.grok-plugin/mcp.json` (`${GROK_PLUGIN_ROOT}`) |
| Claude | `.claude-plugin/plugin.json` `mcpServers` (`${CLAUDE_PLUGIN_ROOT}`) |
| ZCode | `.mcp.json` (`${ZCODE_PLUGIN_ROOT}`) |
| Codex | `.codex-mcp.json` |

## DSH

Harmony / `dsh-only/` ports stay out of this marketplace.
