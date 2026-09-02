---
name: llm-as-a-verifier
description: >
  High-stakes ODW leaves, best-of-N candidate selection, and progress tracking
  on long jobs. Call the llm-as-a-verifier MCP (select / compare / track) or
  pip-installed llm_verifier. Requires a logprobs backend (DeepSeek, Vertex,
  or OpenAI-compatible). Do not wrap every agent() call. Not Advisor evidence.
---

# LLM-as-a-Verifier

Use this skill when you need **PPT-style logprob verification** — not as a
default step on every tool call.

The upstream project is a **Python library** (`pip install llm-verifier`),
not a Cursor or Claude marketplace plugin. This wrap exposes that library as
a **skill + MCP**. Claude Code can also run the official **TurboAgent proxy**
instead of (or in addition to) this MCP.

This plugin ships **no hooks**. Default is skill + MCP only. Do not add
always-on turn scoring; verifier cost compounds (N candidates × M samples).

## When to use

- **High-stakes ODW leaves** — `odw_verifier = llm-as-a-verifier` in
  PJTemplate (`docs/agents/agent_stack.md`). Score a candidate before treating
  it as done.
- **Best-of-N** — several independent answers to the same prompt; pick one
  with `select`.
- **Long jobs** — `track` / `ProgressTracker` on sequential steps to see if
  the trajectory is improving.

## When not to use

- **Never wrap every `agent()` call.** Cost is N×M (N candidates × M
  verification samples). See PJTemplate `execution_policy.md` §6.
- **Not Advisor evidence.** Advisor scores plans against your repo's
  `docs/agents` + git. Verifier scores candidate *text* with another model's
  logprobs. Different jobs.
- **Not a Cursor/Claude runtime proof** that a session went well.

## Cost

Each `select` with N candidates and `n_evaluations` repeats fires many
verifier-model calls. Use on **leaves that matter**, not chat glue.

## Prerequisites

```bash
pip install llm-verifier
```

Or install the vendored checkout (this clone **omits** `data/`, the SWE-bench
dump — see the plugin README):

```bash
pip install -e "${PLUGIN_ROOT}/vendor/llm-as-a-verifier"
```

Set **one** of:

| Variable | Backend |
|----------|---------|
| `DEEPSEEK_API_KEY` | DeepSeek (default in many examples) |
| `VERTEX_API_KEY` | Google Vertex / Gemini |
| `OPENAI_API_KEY` + `OPENAI_BASE_URL` | OpenAI-compatible endpoint that returns **logprobs** |

Claude cannot be the verifier model (no logprobs). It can still *call* this
MCP while DeepSeek/Vertex scores the text.

## MCP tools

Call these via the host MCP server (`mcp/server.py`). They wrap
`llm_verifier.select`, `.compare`, and `.track` — they do **not** reimplement
PPT.

| Tool | Use |
|------|-----|
| `select` | Best-of-N. Args: `problem`, `candidates` (string array), `criteria`, optional `n_evaluations` (default 4), `pivots`, `model`. Returns the winning **index**, ranking, scores. |
| `compare` | Pairwise. Args: `problem`, `trace_a`, `trace_b`, `criteria`, optional `n_evaluations`, `model`. Returns `reward_a` / `reward_b`. |
| `track` | Sequential steps. Args: `problem`, `steps` (string array), optional `checkpoint_steps`, `n_evaluations` (library default 1), `model`. Returns per-step scores. |

`criteria` is a `{name: description}` dict, a bundled name (e.g. `swe_bench`),
or a criteria file path.

If `llm-verifier` is not installed and the vendor tree is missing, or no API
key is set, the tool returns an **error** with install/key instructions. Do
not invent scores.

## Python API (same library)

```python
from llm_verifier import select, compare, track, ProgressTracker

result = select(
    problem,
    candidates,
    criteria={"Correctness": "Does it solve the task?"},
    n_evaluations=4,
)
reward_a, reward_b = compare(
    problem, a, b,
    criteria={"Overall": "Does it solve the problem?"},
)
scores = track(problem, steps)
pt = ProgressTracker(problem)
pt.update("did the thing")
```

`llm_verifier.select` returns a `VerifierResult` (`.index`, `.ranking`,
`.scores`). Do not reimplement the pivot tournament in the host.

## Claude Code: TurboAgent proxy (optional)

The official Claude integration is **TurboAgent**, an Anthropic-compatible
**proxy**, not a skill pack:

```bash
pip install turbo-agent
turbo-agent   # default http://localhost:8888
ANTHROPIC_BASE_URL=http://localhost:8888 claude
```

Use that when you want verification on the **API path**. Use **this plugin's
MCP** when you want explicit `select` / `compare` / `track` tools in Cursor,
Grok, Codex, ZCode, or Claude-with-MCP.

## DSH / Harmony

Harmony ports (`dsh-only/`) stay out of this marketplace. Install those from
the framework repo if you need them.
