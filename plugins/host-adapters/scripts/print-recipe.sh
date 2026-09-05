#!/usr/bin/env bash
# SPIKE stub — print/help only. Does not install, seat, doctor, or attest.
#
# Prints the Codex or ZCode seating recipe. Does not run it.
# Does not claim a pass. Does not launch workflow() or invent Lane B.
set -euo pipefail
root=$(CDPATH= cd "$(dirname "$0")/.." && pwd) || exit 1
host=

usage() {
  printf '%s\n' \
    'SPIKE stub: host-adapters print-recipe — not enforcing, not a seating pass' \
    'Usage: print-recipe.sh --host codex|zcode' \
    'Prints the recipe file. Does not install or doctor.'
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --host)
      [ "$#" -ge 2 ] && [ -n "${2:-}" ] || { usage; printf '%s\n' 'SPIKE stub: --host requires a value (not a pass)' >&2; exit 2; }
      host=$2
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      usage
      printf '%s\n' "SPIKE stub: unknown argument: $1 (not a pass)" >&2
      exit 2
      ;;
  esac
done

case "$host" in
  codex|zcode)
    recipe="$root/recipes/${host}.md"
    ;;
  '')
    usage
    printf '%s\n' 'SPIKE stub: --host is required (codex or zcode). This is not a seating pass.' >&2
    exit 2
    ;;
  *)
    printf '%s\n' "SPIKE stub: unsupported host '$host' (codex or zcode only). Not a seating pass. Cursor/Claude/Grok are later." >&2
    exit 2
    ;;
esac

[ -f "$recipe" ] || { printf '%s\n' "SPIKE stub: missing recipe $recipe (not a pass)" >&2; exit 2; }

printf '%s\n' "SPIKE stub: host-adapters print-recipe --host $host — not enforcing, not a seating pass"
printf '%s\n' "--- $recipe ---"
cat "$recipe"
printf '\n%s\n' 'SPIKE stub: printed recipe only. Do not treat this output as PASS or Lane B.'
exit 0
