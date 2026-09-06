# Fork maintenance

atebites-hub forks in this marketplace follow the Project Factory fork-maintenance policy. factory-policy exists as an in-repo **P2 v1 warn-default** plugin (`plugins/factory-policy/`) — catalog-listed for pin install as `factory-policy@atebites-plugins`, not a Factory default, not a submodule. host-adapters exists only as an in-repo **P2–P3 SPIKE stub** (`plugins/host-adapters/`) — docs+scripts, not a bot, not a catalog plugin, not a Factory default, not a submodule. It does not replace Factory Harness bot. linear-tracking exists as an in-repo **P N interim** skill-body vendor (`plugins/linear-tracking/vendor/linear/` @ openai/skills `49f948faa9258a0c61caceaf225e179651397431`) plus Factory placement — not Superpowers-class, not a catalog plugin, not a Factory default, not a submodule. Parent openai/skills is deprecated; replace when a standalone OSI-licensed plugin appears. Factory Plugins bot should not gitlink openai/plugins / anthropics catalogs or fork unlicensed `linear/cursor-plugin`. gitnexus exists as an in-repo **P N thin wrap** (`plugins/gitnexus/` pins npm `gitnexus@1.6.7`) — catalog-listed for pin install as `gitnexus@atebites-plugins`, not a Factory default, not a submodule, not a full atebites-hub fork of the PolyForm-NC GitNexus monorepo. Factory Plugins bot should not true-fork `abhigyanpatwari/GitNexus` from this wrap. The rules below are still binding.

Owners: **Jaskarn**, **Factory Plugins bot**.

## Policy

- **True GitHub fork when possible.** `origin` is the atebites-hub repo; `upstream` is the canonical parent.
- **`UPSTREAM.md` in every fork.** Record the upstream URL, last-synced base SHA, atebites-only divergence, and sync instructions.
- **Weekly weekday sync.** If upstream moved, open `chore: sync upstream`. Security fixes sync within 24 hours.
- **Marketplace pin bumps only after** the fork's CI is green and the smoke matrix below has been attempted. Do not bump submodule SHAs on hope.
- **Do not fake green.** If a host harness is missing, record `not run — harness absent`.

## Smoke matrix

| Surface | What to run |
| --- | --- |
| ZCode CLI | `--prompt` hello (plus JSON / attestation when the plugin claims it) |
| ODW | one-leaf workflow on zcode plus one other executor |
| Cursor / Grok / Claude / Codex | marketplace install, or `--plugin-dir` when that is how the plugin ships |

Live status for every marketplace submodule and nested pin: [FORK-INDEX.md](FORK-INDEX.md).
