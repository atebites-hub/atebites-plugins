#!/usr/bin/env bash
# SPIKE stub — prints seating recipe steps. Does not install, trust, launch,
# or attest. Exit 0 is "printed the stub," not a seating pass.
#
# Usage: print-recipe.sh --host codex|zcode|checklist
set -euo pipefail

usage() {
  printf 'usage: %s --host codex|zcode|checklist\n' "${0##*/}" >&2
}

host=""
if [[ "${1:-}" == "--host" ]]; then
  host="${2:-}"
elif [[ -n "${1:-}" ]]; then
  host="${1}"
fi

case "${host}" in
  codex)
    printf '%s\n' \
      'SPIKE stub: host-adapters Codex recipe — not enforcing, not a seating pass' \
      'Not a bot. Not a Factory default. Does not replace Factory Harness bot.' \
      'Does not auto-trust /hooks. Does not launch a run. No soft-pass.' \
      '' \
      '1. Pin SHA — catalog pins only (do not bump from this pack)' \
      '   Superpowers b36e0829… / ponytail 911022dc… / Advisor 39bc5f1d… / ODW 9708a77a…' \
      '2. Install/enable Factory defaults (codex plugin add …@atebites-plugins)' \
      '3. advisor doctor --host codex' \
      '   expects open-dynamic-workflows@open-dynamic-workflows at 0.3.0 enabled' \
      '   marketplace twin @atebites-plugins does not satisfy doctor alone' \
      '4. Codex /hooks trust — user-gated; no bypass; this script never passes a trust flag' \
      '5. Optional one-leaf: launch workflow() via workflow MCP, then --run-dir' \
      '   (smoke does not auto-launch; fail-closed)'
    ;;
  zcode)
    printf '%s\n' \
      'SPIKE stub: host-adapters ZCode recipe — not enforcing, not a seating pass' \
      'Not a bot. Not a Factory default. Does not replace Factory Harness bot.' \
      'Does not auto-trust hooks. Does not launch a run. No soft-pass.' \
      '' \
      '1. Pin SHA — catalog pins only (do not bump from this pack)' \
      '   Advisor catalog pin 39bc5f1d… lacks #12 .plugins[] matcher; tip 8fc0bcf0… has it' \
      '2. Install/enable Factory defaults; advisor apply --host zcode if settings empty' \
      '3. advisor doctor --host zcode' \
      '   ZCode list shape .plugins[].id' \
      '   expects open-dynamic-workflows@open-dynamic-workflows at 0.3.0 enabled' \
      '   marketplace twin @atebites-plugins does not satisfy doctor alone' \
      '4. No Codex /hooks step on ZCode — do not invent a bypass' \
      '5. Optional one-leaf: launch workflow() via workflow MCP, then --run-dir' \
      '   (smoke does not auto-launch; fail-closed)'
    ;;
  checklist)
    printf '%s\n' \
      'SPIKE stub: host-adapters shared checklist — not enforcing, not a seating pass' \
      'Not a bot. Not a Factory default. Does not replace Factory Harness bot.' \
      'Cursor / Claude / Antigravity are parked placeholders. No invented doctor.' \
      'Does not auto-trust hooks. Does not launch a run. No soft-pass.'
    ;;
  *)
    usage
    exit 1
    ;;
esac

exit 0
