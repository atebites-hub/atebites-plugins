#!/usr/bin/env bash
# SPIKE stub — print/help only. Does not install, seat, doctor, or attest.
#
# Today: print how to use this pack. Do not claim a seating pass.
# Do not run advisor doctor. Do not launch workflow(). Do not invent Lane B.
set -euo pipefail
root=$(CDPATH= cd "$(dirname "$0")/.." && pwd) || exit 1
printf '%s\n' \
  'SPIKE stub: host-adapters print-help — not a Factory default, not a bot, not a seating pass' \
  '' \
  'Pack: '"$root" \
  'Spike: docs/SPIKE-HOST-ADAPTERS.md' \
  'factory-policy (upcoming-only, do not seat): docs/SPIKE-FACTORY-POLICY.md' \
  '' \
  'Usage:' \
  '  bash plugins/host-adapters/scripts/print-help.sh' \
  '  bash plugins/host-adapters/scripts/print-recipe.sh --host codex|zcode' \
  '  bash plugins/host-adapters/scripts/print-checklist.sh' \
  '' \
  'Seat only: Superpowers, ponytail, Advisor, ODW.' \
  'Do not seat CE, taskboard, j-space, or factory-policy.' \
  'Never --dangerously-bypass-hook-trust.' \
  'Never auto-fake PASS / Lane B attestation.' \
  'Marketplace name factory-harness is killed. This pack is host-adapters.'
exit 0
