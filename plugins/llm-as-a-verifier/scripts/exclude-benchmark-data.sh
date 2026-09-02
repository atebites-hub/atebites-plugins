#!/usr/bin/env sh
# Drop the optional SWE-bench / Terminal-Bench trajectory dump from the
# llm-as-a-verifier submodule worktree. The library and docs stay. Git
# objects may still occupy ~67MB until the submodule is recloned with
# --filter=blob:none.
set -eu
script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd) || exit 1
repo=$(CDPATH= cd "$script_dir/../vendor/llm-as-a-verifier" && pwd) || exit 1
cd "$repo"
git sparse-checkout init --no-cone
git sparse-checkout set '/*' '!/data' '!/data/**'
printf '%s\n' "excluded $repo/data (benchmark trajectories)"
