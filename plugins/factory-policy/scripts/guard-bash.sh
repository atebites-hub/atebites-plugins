#!/usr/bin/env bash
# SPIKE stub — not production-enforcing.
#
# v1 Tier 1 guard-bash: native git hook (core.hooksPath / .githooks/pre-commit).
# Host-agnostic spine. On staged src/** (and the matching docs/memories/ file),
# run the same C3.x–C7 field checks. This is the authoritative local gate;
# harness PreToolUse/Stop are accelerators only. CI remains the merge backstop.
#
# Today: do not read the index, do not claim a pass, do not soft-pass C3–C7.
set -euo pipefail
printf 'SPIKE stub: factory-policy guard-bash (Tier 1) — not enforcing C3.x–C7\n'
exit 0
