---
name: native-orchestration
description: Route multi-agent engineering work to the current harness's native orchestration when the user asks for delegation, parallel work, or a workflow. Use when choosing a host-native execution path or replacing an old ODW invocation; ordinary single-agent work needs no orchestration.
---

# Native orchestration

Use the current host's built-in orchestration. ODW and the atebites-hub/kingsword09
ZCode CLI wrappers are retired for this workspace. Do not install, launch, repair,
or silently fall back to them. This skill supplies guidance only: no MCP server,
CLI adapter, scheduler, subprocess supervisor, or substitute workflow engine.

Identify the actual host and surface from available tools and application context.
Do not identify Grok Bot as Grok Build, or Antigravity IDE as Antigravity 2.0.

| Current host | Native route |
| --- | --- |
| Claude Code / compatible Claude harness | Use native ultracode when available, following the user's existing preference. Otherwise use the exposed native delegation tools and report the unavailable mode. |
| Codex / ChatGPT Work | Use native agent delegation; recommend the user's preferred Ultra mode where that client/model supports it. Preserve the selected model and settings; do not invent a `/ultra` command. |
| Cursor editor / Agents Window | Use `/multitask` or Build in Parallel for independent work. Use native subagents for bounded delegation. |
| Cursor CLI | Use the native subagent tools actually exposed by that CLI. Do not assume every editor slash command exists in the CLI. |
| Grok Build | Author a saved native workflow with `/create-workflow`; run it with `/workflow <name>`. Use `/workflows` for status and native pause/resume/stop controls. |
| Grok Bot | Use native Bot collaboration for distinct tasks and durable roles. Do not spawn another coding CLI or use ODW as an automatic fallback. |
| Antigravity 2.0 | Use `/boost` for a difficult bounded engineering task; `/teamwork-preview` for an explicitly chosen long campaign. Both require eligible account access. |
| Antigravity CLI (`agy`) | Use its native `/boost`, `/teamwork-preview`, and subagent tools with the same scope and account checks. |
| Antigravity IDE | Use native capabilities actually exposed in this surface. Markdown Workflows/Skills are procedures, not proof of the 2.0/CLI orchestration engine. |
| Official ZCode Desktop / official CLI | Recommend `/workflow <task>`; it loads the native dynamic-workflows skill and uses `CreateWorkflow`. Ordinary delegation uses native `Agent`. |
| Copilot / other hosts | Inspect current native capabilities before delegating. If no suitable route exists, work inline or report the limitation; do not reintroduce ODW. |

Start an orchestrated run only within the user's authorization and the host's
invocation rules. ZCode requires an explicit workflow request; recommending the
command does not execute it. Do not fabricate a slash command as a tool call.
When the client requires a UI mode change, explain that step rather than silently
changing model, effort, billing tier, permissions, or approval settings.

Keep native execution bounded by the task. Give workers distinct ownership and
acceptance evidence. Context isolation is not workspace isolation: parallel code
writers need independent worktrees or a verified equivalent; otherwise serialize
writes. A workflow reporting done is not proof that its tests passed.

Known qualification boundaries (recheck after vendor updates): ZCode Desktop
3.14.1 rejects native workflow worktree isolation. Grok Build 1.0.34 cannot resume
an interrupted workflow across process restart. Native credentials, child policy
hooks, cancellation cleanup, and plan benefits remain host-owned; this skill does
not claim to implement or verify them. In particular, official ZCode runtime use
alone is not proof of the 150% Coding Plan allowance.
