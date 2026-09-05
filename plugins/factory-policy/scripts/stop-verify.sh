#!/usr/bin/env bash
# SPIKE stub — not production-enforcing.
#
# v1 Stop / stop: re-check the task-memory ledger (C3.x–C7). If incomplete,
# return blocking feedback so the model continues. Honor a hop cap (numeric
# limit TBD in v1 — do not invent it here) so verify cannot loop forever.
#
# Today: do not verify, do not count hops, do not claim a pass.
set -euo pipefail
printf 'SPIKE stub: factory-policy stop-verify (hop cap TBD) — not enforcing C3.x–C7\n'
exit 0
