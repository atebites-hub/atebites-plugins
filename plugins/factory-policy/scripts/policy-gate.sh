#!/usr/bin/env bash
# SPIKE stub — not production-enforcing.
#
# v1 PreToolUse / preToolUse: read harness stdin JSON, if the edit path is
# under src/**, require the task memory to satisfy C3.1 doc-cited, C3.2
# scope-literal, C3.3 plan-filled, C5 gate-runnable, C6 issue-linked, C7
# plan-approved. Block (host-specific non-zero / decision) on failure.
# Matcher is tool-name; path filter lives here.
#
# Today: do not inspect stdin, do not claim a pass, do not soft-pass C3–C7.
set -euo pipefail
printf 'SPIKE stub: factory-policy policy-gate (PreToolUse src/**) — not enforcing C3.x–C7\n'
exit 0
