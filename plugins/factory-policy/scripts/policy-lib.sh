# Shared helpers for factory-policy hook scripts.
# Sourced, not executed. Do not print "SPIKE stub". Do not claim a pass
# when checkers did not run.

# shellcheck shell=bash

POLICY_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FACTORY_POLICY_ROOT="$(cd "$POLICY_LIB_DIR/.." && pwd)"
FACTORY_POLICY_CHECKER="$FACTORY_POLICY_ROOT/scripts/check_memory_policy.py"

factory_policy_repo_root() {
  if [[ -n "${FACTORY_POLICY_REPO_ROOT:-}" ]]; then
    printf '%s\n' "$FACTORY_POLICY_REPO_ROOT"
    return 0
  fi
  pwd
}

factory_policy_fail_open() {
  printf 'factory-policy: %s (fail-open)\n' "$1" >&2
  return 0
}

factory_policy_require_python() {
  if command -v python3 >/dev/null 2>&1; then
    return 0
  fi
  factory_policy_fail_open "python3 not found; skipping enforcement"
  return 1
}

# Map checker exit codes for harness hooks: fail-mode violation → 2 (block).
# Environment → fail-open 0. Usage stays 2.
factory_policy_map_hook_exit() {
  local rc=$1
  case "$rc" in
    0) return 0 ;;
    1) return 2 ;;
    2) return 2 ;;
    3)
      factory_policy_fail_open "checker environment error"
      return 0
      ;;
    *)
      factory_policy_fail_open "checker exited $rc"
      return 0
      ;;
  esac
}

factory_policy_run_checker() {
  local repo
  repo="$(factory_policy_repo_root)"
  python3 "$FACTORY_POLICY_CHECKER" --repo-root "$repo" "$@"
}

factory_policy_path_is_src() {
  local path=$1
  case "$path" in
    src|src/*|*/src|*/src/*) return 0 ;;
    *) return 1 ;;
  esac
}

factory_policy_collect_changed_paths() {
  local repo
  repo="$(factory_policy_repo_root)"
  if ! command -v git >/dev/null 2>&1; then
    return 0
  fi
  if ! git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    return 0
  fi
  {
    git -C "$repo" diff --name-only HEAD 2>/dev/null || true
    git -C "$repo" diff --name-only --cached 2>/dev/null || true
    git -C "$repo" ls-files --others --exclude-standard 2>/dev/null || true
  } | sort -u
}

factory_policy_src_changed() {
  local override="${FACTORY_POLICY_SRC_CHANGED:-}"
  case "$override" in
    1|true|yes) return 0 ;;
    0|false|no) return 1 ;;
  esac

  local path
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    if factory_policy_path_is_src "$path"; then
      return 0
    fi
  done < <(factory_policy_collect_changed_paths)
  return 1
}

factory_policy_staged_src() {
  local override="${FACTORY_POLICY_SRC_CHANGED:-}"
  case "$override" in
    1|true|yes) return 0 ;;
    0|false|no) return 1 ;;
  esac

  local repo path
  repo="$(factory_policy_repo_root)"
  if ! command -v git >/dev/null 2>&1; then
    return 1
  fi
  if ! git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    return 1
  fi
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    if factory_policy_path_is_src "$path"; then
      return 0
    fi
  done < <(git -C "$repo" diff --name-only --cached 2>/dev/null || true)
  return 1
}
