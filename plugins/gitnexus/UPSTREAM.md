# gitnexus wrap pin

**Status:** Upcoming / **P N** / not a Factory default.
Catalog-listed for pin install as `gitnexus@atebites-plugins`.
**Not** wired into project-factory `enabledPlugins`. **Not** a full
atebites-hub fork. Not Superpowers-class.

Thin marketplace wrap of the npm MCP entrypoint. Jay lock
(D-GITNEXUS / MASTER-PLAN §4.3): pin the version in this catalog so
Factory is not stuck on template-only `npx`. Do not float `main` or
`gitnexus@latest`. Do not claim Factory-default seating.

## Pin (npm; not a gitlink)

| Field | Value |
| --- | --- |
| **Upstream repo** | [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) |
| **npm package** | [`gitnexus`](https://www.npmjs.com/package/gitnexus) |
| **Pinned version** | **1.6.7** (published 2026-06-09) |
| **npm gitHead (1.6.7)** | `1cf65b339c8acfc1a27f5c9463c52e4604079fbd` |
| **Command** | `npx -y gitnexus@1.6.7 mcp` |
| **License** | PolyForm-Noncommercial-1.0.0 (upstream). Wrap manifests are MIT. |
| **Local tree** | host `plugin.json` + `mcp.json` / `.mcp.json` only |

npm `gitHead` values above came from `registry.npmjs.org` on
2026-09-06. They are **not** marketplace gitlinks.

## Latest stable (observed; not the pin)

Verified 2026-09-06 against `registry.npmjs.org`:

| Tag / version | Value | Why it is not the pin |
| --- | --- | --- |
| dist-tag `latest` | **1.6.11** (2026-09-04; npm gitHead `c0c3fa18a9b27d210099f908095fec373dd3d2d5`) | Newer than the template. No Factory smoke. Tighter Node engines (`^22.18.0 or >=24.11.0` vs 1.6.7 `>=22.0.0`). |
| dist-tag `rc` | `1.6.12-rc.3` | Prerelease. Do not pin. |
| monorepo `main` tip | `a049b2dac6433b3c13185e226483fa85743dab1e` (2026-09-05) | Floating HEAD. Not a Factory pin. |

Prefer the template’s **1.6.7** unless a later PR documents a security
or seating reason and bumps after CI +
[smoke](../../docs/FORK-MAINTENANCE.md#smoke-matrix).

## Why not a full atebites-hub fork yet

A true-fork + weekday sync of [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus)
is **worse** on day one than this wrap:

1. **License.** Upstream LICENSE is PolyForm Noncommercial 1.0.0
   (GitHub `license` = `NOASSERTION`). Required Notice: Copyright
   Abhigyan Patwari (https://github.com/abhigyanpatwari/GitNexus).
   Weekday-syncing a PolyForm-NC monorepo into atebites-hub is not an
   honest first step. This wrap does not relicense or vendor the tree.
2. **Size / shape.** The repo is a private monorepo (`gitnexus-monorepo`)
   with `gitnexus`, `gitnexus-web`, `gitnexus-shared`, eval, and editor
   integration packages. npm `gitnexus@1.6.11` unpacks to ~153 MB with
   native tree-sitter / Kuzu addons. Not a Superpowers-class plugin repo.
3. **Upstream already floats.** Monorepo `.mcp.json` and
   `gitnexus-claude-plugin/.mcp.json` use `gitnexus@latest`. Copying
   those packages would reintroduce the float this wrap exists to stop.
4. **No atebites fork today.** `atebites-hub/gitnexus` was **not found**
   (GitHub API 404, 2026-09-06). Factory Plugins bot: **do not create
   that fork** from this spike.

Replace this wrap with a true-fork + `UPSTREAM.md` + weekday sync only
if upstream becomes an OSI-licensed standalone plugin repo (or Factory
explicitly accepts PolyForm-NC fork maintenance). Until then: P N,
catalog-listed for pin install, not Factory default.

## Candidates inspected (not Factory pins)

| Candidate | What it is | Evidence (2026-09-06) | Why it is not a Factory pin |
| --- | --- | --- | --- |
| npm `gitnexus@latest` / `@1.6.11` | Current stable tarball | dist-tag `latest` = 1.6.11; gitHead `c0c3fa18a9b27d210099f908095fec373dd3d2d5` | Newer than the template; no smoke; not selected. |
| npm `gitnexus@rc` | Prerelease line | `1.6.12-rc.3` | RC. Do not pin. |
| Monorepo `main` | Full GitNexus tree | HEAD `a049b2dac6433b3c13185e226483fa85743dab1e` | Float. PolyForm-NC. Too large to gitlink. |
| `gitnexus-claude-plugin/` | In-monorepo Claude plugin (`version` 1.6.11) + `.mcp.json` → `gitnexus@latest` | path exists on `main` | Claude subtree that **floats `@latest`**. Same monorepo-gitlink reject as openai/plugins. |
| `gitnexus-cursor-integration/` | In-monorepo Cursor hooks/skills | path exists on `main` | Not a standalone OSI plugin. Would look like full GitNexus editor integration shipped. |
| Template-only `.mcp.json` | project-factory `npx -y gitnexus@1.6.7 mcp` | Jay lock D-GITNEXUS | The thing this wrap replaces later. Assistant owns template seating. |

Do **not** copy those remotes into `.gitmodules`. Factory Plugins bot:
do not fork `abhigyanpatwari/GitNexus` from this spike.

## Divergence (atebites-only)

| Piece | Why |
| --- | --- |
| `mcp.json` / `.mcp.json` | Pin `gitnexus@1.6.7` instead of `@latest` |
| Host `plugin.json` wraps | Thin manifests. Catalog-listed for pin install. Not Factory default. |
| This file + `NOTICE` | Pin record + PolyForm-NC attribution + no-fork rationale |

No skills overlay. No hooks. MCP tool schemas stay whatever the pinned
npm package exposes — this wrap does not freeze or invent them.

## Sync (interim; not a weekly fork loop)

1. Do **not** float `gitnexus@latest` or GitNexus `main`.
2. Factory Plugins bot: **do not fork yet.**
3. To bump the pin: change `mcp.json` and `.mcp.json` together, update
   this file with a real npm version + `gitHead` from the registry, and
   bump only after CI + [smoke](../../docs/FORK-MAINTENANCE.md#smoke-matrix).
4. Do not add project-factory `enabledPlugins` or edit the template
   `.mcp.json` in a pin-bump PR (Assistant).
5. Lane B smoke: `not run — Lane B awaiting Jay credentials`. Missing
   MCP is fail-closed, not a pass.
