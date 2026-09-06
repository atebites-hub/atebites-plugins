#!/usr/bin/env bash
# factory-policy v1 — Tier 1 git / optional regex deny (warn-default).
#
# When staged code paths exist (default src/**), run the same C3.1–C3.3/C5/C6 checkers on
# in_progress memories. Fail-mode → exit 1 (git hook block).
# Optional: GUARD_BASH_COMMAND or $1 is a shell command to regex-deny.
# Environment errors fail-open. No SPIKE-stub soft-pass.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=policy-lib.sh
source "$SCRIPT_DIR/policy-lib.sh"

denied=0
command_text="${GUARD_BASH_COMMAND:-}"
if [[ -z "$command_text" && "${1:-}" != "" && "${1:-}" != -* ]]; then
  command_text="$1"
fi
if [[ -n "$command_text" ]]; then
  if printf '%s' "$command_text" | grep -Eq 'rm[[:space:]]+-rf[[:space:]]+(/|/\*|~)'; then
    denied=1
  elif printf '%s' "$command_text" | grep -Eq 'curl[[:space:]]+[^|]*\|[[:space:]]*(bash|sh)'; then
    denied=1
  elif printf '%s' "$command_text" | grep -Eq 'wget[[:space:]]+[^|]*\|[[:space:]]*(bash|sh)'; then
    denied=1
  elif printf '%s' "$command_text" | grep -Eq 'mkfs\.'; then
    denied=1
  elif printf '%s' "$command_text" | grep -Fq ':(){ :|:& };:'; then
    denied=1
  elif printf '%s' "$command_text" | grep -Eq 'dd[[:space:]]+if=/dev/zero[[:space:]]+of=/dev/'; then
    denied=1
  fi
  if [[ "$denied" -eq 1 ]]; then
    printf '[guard-bash] denied dangerous command\n' >&2
    printf 'Fix: do not run destructive or pipe-to-shell commands from the hook path\n' >&2
    exit 1
  fi
fi

if ! factory_policy_require_python; then
  exit 0
fi

set +e
factory_policy_staged_src
staged_rc=$?
set -e
if ! factory_policy_decide_code_path_gate "$staged_rc" \
  "no staged code paths; skipped (not a pass)"; then
  exit 0
fi

set +e
factory_policy_run_checker gate-in-progress
check_rc=$?
set -e
case "$check_rc" in
  0) exit 0 ;;
  1) exit 1 ;;
  2) exit 1 ;;
  3)
    factory_policy_fail_open "checker environment error"
    exit 0
    ;;
  *)
    factory_policy_fail_open "checker exited $check_rc"
    exit 0
    ;;
esac
