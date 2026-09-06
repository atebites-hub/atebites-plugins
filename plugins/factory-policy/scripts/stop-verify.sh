#!/usr/bin/env bash
# factory-policy v1 — Stop / stop verify (warn-default).
#
# When configured code paths changed (default src/**), re-check
# in_progress memories (C3.1–C3.3, C5, C6).
# Hop-cap numeric limit is TBD — this script runs checkers once and does not
# invent a hop number. Fail-mode violation → exit 2 (hook block).
# Environment errors fail-open. No SPIKE-stub soft-pass.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=policy-lib.sh
source "$SCRIPT_DIR/policy-lib.sh"

if ! factory_policy_require_python; then
  exit 0
fi

set +e
factory_policy_src_changed
changed_rc=$?
set -e
if ! factory_policy_decide_code_path_gate "$changed_rc" \
  "code paths unchanged; skipped (not a pass)"; then
  exit 0
fi

printf 'factory-policy stop-verify: hop cap not implemented (TBD); running checkers once\n' >&2

set +e
factory_policy_run_checker gate-in-progress
check_rc=$?
set -e
factory_policy_map_hook_exit "$check_rc"
exit $?
