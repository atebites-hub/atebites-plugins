# ODW and custom ZCode CLI retirement

On 2026-09-21 the owner retired ODW and the atebites-hub/kingsword09 ZCode CLI
forks from this marketplace. `native-orchestration` is the skill-only replacement.

All five host catalogs now point to the inline skill. There is no replacement
MCP service, workflow runner, custom CLI, or new standalone repository. The ODW
gitlink and its nested CLI dependency are removed. Historical QA, fork-index,
and host-recipe documents are retained as records and marked retired.

The routing skill names Antigravity 2.0 and Antigravity CLI separately, alongside
Claude, Codex/ChatGPT, Cursor, Grok Build, Grok Bot, and official ZCode. Missing
native capabilities stay explicit; no silent ODW fallback is allowed.

Factory-policy 0.1.2 accepts native-orchestration scope and remains compatible
with old ODW task memories. Permission and hook enforcement is unchanged.

Validation: marketplace schema checks, package/skill validation, 61 Node tests,
43 factory-policy Python tests, and the skill-only/no-MCP catalog check passed.
These are package/policy checks, not live qualification of every native engine.

Official ZCode Desktop 3.14.1's bundled CLI lacks @zcode/tui. Its headless login
and 150% allowance are unresolved; source build instructions do not establish
that a complete vendor CLI binary is distributed. Do not restore the retired
fork to mask this vendor packaging boundary.

## Taskboard retirement (2026-09-21)

Taskboard is also removed from all five catalogs, including its plugin/MCP
manifests and upstream gitlink. Factory already prohibited its hooks and default
activation; setup now records strip explicitly. No task database or standalone
Taskboard installation was deleted.
