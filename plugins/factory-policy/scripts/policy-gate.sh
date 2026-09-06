#!/usr/bin/env bash
# factory-policy v1 — PreToolUse / preToolUse gate (warn-default).
#
# Modes:
#   check-memory <path>  checker exit contract 0/1/2/3 (policy-gate.md §2.1)
#   edit                 harness hook (default): code paths (default src/**) require in_progress
#                        memory that passes checkers. Fail-mode → exit 2.
#
# Not a Factory default. Catalog-listed for pin install only. No SPIKE-stub soft-pass.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=policy-lib.sh
source "$SCRIPT_DIR/policy-lib.sh"

usage() {
  cat >&2 <<'EOF'
usage: policy-gate.sh [edit]
       policy-gate.sh check-memory <path>

edit (default): read harness stdin JSON; if the path matches [paths].code
(default src/**), require an in_progress docs/memories/ file that passes
C3.1–C3.3/C5/C6. Warn → 0.
Fail-mode violation → 2 (hook block). Environment errors fail-open (0).

check-memory: run checkers on <path> (exit 0 pass/warn, 1 fail, 2 usage, 3 env).
EOF
}

mode="${1:-edit}"
case "$mode" in
  -h|--help)
    usage
    exit 0
    ;;
  check-memory)
    shift || true
    path="${1:-}"
    if [[ -z "$path" ]]; then
      printf 'factory-policy: check-memory requires a memory path\n' >&2
      usage
      exit 2
    fi
    if ! command -v python3 >/dev/null 2>&1; then
      printf 'factory-policy: python3 not found\n' >&2
      exit 3
    fi
    set +e
    factory_policy_run_checker "$path"
    rc=$?
    set -e
    exit "$rc"
    ;;
  edit)
    shift || true
    ;;
  *)
    printf 'factory-policy: unknown mode %s\n' "$mode" >&2
    usage
    exit 2
    ;;
esac

if ! factory_policy_require_python; then
  exit 0
fi

stdin_json="$(cat || true)"
if [[ -z "${stdin_json//[[:space:]]/}" ]]; then
  printf 'factory-policy: no tool path on stdin; skipped (not a pass)\n' >&2
  exit 0
fi

set +e
edit_path="$(printf '%s' "$stdin_json" | factory_policy_run_checker extract-path)"
extract_rc=$?
set -e
if [[ "$extract_rc" -ne 0 ]]; then
  factory_policy_fail_open "could not read hook path"
  exit 0
fi

if [[ -z "$edit_path" ]]; then
  printf 'factory-policy: hook JSON has no edit path; skipped (not a pass)\n' >&2
  exit 0
fi

set +e
factory_policy_run_checker is-src-path "$edit_path"
src_rc=$?
set -e
if ! factory_policy_decide_code_path_gate "$src_rc" \
  "path not under code paths; skipped (not a pass)"; then
  exit 0
fi

set +e
factory_policy_run_checker gate-in-progress
check_rc=$?
set -e
factory_policy_map_hook_exit "$check_rc"
exit $?
