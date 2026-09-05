#!/usr/bin/env bash
# SPIKE stub — print/help only. Does not check boxes or attest.
#
# Prints the shared seating checklist. Operator/QA check the boxes.
# Today: do not claim a pass. Do not invent Lane B attestation.
set -euo pipefail
root=$(CDPATH= cd "$(dirname "$0")/.." && pwd) || exit 1
checklist="$root/recipes/CHECKLIST.md"
[ -f "$checklist" ] || { printf '%s\n' "SPIKE stub: missing $checklist (not a pass)" >&2; exit 2; }
printf '%s\n' 'SPIKE stub: host-adapters print-checklist — not enforcing, not a seating pass'
printf '%s\n' "--- $checklist ---"
cat "$checklist"
printf '\n%s\n' 'SPIKE stub: printed checklist only. Unchecked boxes are not a pass. No Lane B attestation.'
exit 0
