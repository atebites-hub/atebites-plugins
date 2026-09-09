# SPIKE: gitnexus (marketplace wrap)

**Status:** Thin marketplace wrap chosen — **Upcoming / P N** /
catalog-listed for pin install / not a Factory default.
**Not** wired into project-factory `enabledPlugins`. **Not** a claim
that GitNexus is Factory-installed. **Not** Dogfood Cursor live QA /
Lane B. Not Superpowers-class.

This catalog path keeps `plugins/gitnexus/` as an **upcoming** inline
MCP wrap (not a submodule of abhigyanpatwari/GitNexus), the same class
as factory-policy (catalog-listed, not default) and linear-tracking
(honesty / P N). Host marketplaces **do** list it so Assistant can seat
later via `enabledPlugins`. Catalog listing is installability only.
Do not invent secrets. Do not treat missing MCP as a working graph (no
soft-pass). Pin record + no-fork table:
[`plugins/gitnexus/UPSTREAM.md`](../plugins/gitnexus/UPSTREAM.md).

The pack name is **`gitnexus`**. Jay lock (2026-09-06): **D-GITNEXUS /
MASTER-PLAN §4.3 / §5** — start F→P wrap. Project-factory today only
has template `.mcp.json`:

```json
"gitnexus": { "command": "npx", "args": ["-y", "gitnexus@1.6.7", "mcp"] }
```

That template line is **not** a marketplace pin. This spike is.

## Binding SoT (do not invent ownership)

| Piece | Owns | Does not own |
| --- | --- | --- |
| **`gitnexus` wrap** | Marketplace pin of `npx -y gitnexus@1.6.7 mcp`; host manifests; honesty that this is not Factory default | GitNexus product code; MCP tool schemas; template seating; Lane B |
| **npm `gitnexus`** | Index + MCP server at the pinned version | Factory placement; catalog promotion |
| **project-factory `.mcp.json`** | Current template seating (Assistant later) | Marketplace pin; this wrap's version file |
| **Assistant** | Replace template `.mcp.json` / add `enabledPlugins` later | This catalog claiming the seat landed |
| **Factory Plugins bot** | Must **not** true-fork the monorepo from this spike | Weekday sync that does not exist yet |
| **taskboard / CE / j-space** | Discarded from Factory | This path |

This spike does **not** change factory-policy, linear-tracking,
host-adapters, Superpowers, ponytail, Advisor, or ODW pins.

## Pin (chosen — wrap / P N)

Jay lock: marketplace-installable **pinned** version — not forever
floating template npx-only. Same *intent* as other Factory pins: record
a version; do not float `latest` / `main`. This is not Superpowers-class.

| Field | Value |
| --- | --- |
| **Upstream** | https://github.com/abhigyanpatwari/GitNexus |
| **npm** | `gitnexus@1.6.7` |
| **npm gitHead** | `1cf65b339c8acfc1a27f5c9463c52e4604079fbd` (registry, 2026-09-06) |
| **Transport** | local stdio MCP via `npx` |
| **Class** | Upcoming / **P N** / thin wrap — not Factory default |

Latest npm stable observed 2026-09-06 is **1.6.11** (gitHead
`c0c3fa18a9b27d210099f908095fec373dd3d2d5`). Pin stays **1.6.7**
because that is the template pin, 1.6.7 is still published, and there
is no Factory smoke of 1.6.11. `rc` is `1.6.12-rc.3` — do not pin.

Official upstream MCP configs float `gitnexus@latest`. Rejected as a
Factory pin. See `UPSTREAM.md`.

Do not claim the wrap is Factory-installed.

## Why thin wrap (not a full fork)

Hypothesis confirmed:

1. Template already uses the npm MCP command. Wrapping that command is
   the F→P path.
2. A day-one true-fork of the whole monorepo is a PolyForm-NC, ~153 MB,
   native-addon tree that already floats `@latest` in its own editor
   plugins. That is not weekday-sync Factory material.
3. `atebites-hub/gitnexus` does not exist (404, 2026-09-06). Do not
   create it from this spike.

If a standalone OSI-licensed plugin appears, **replace** this wrap with
true-fork + weekday sync. Until then: P N.

## Replace-template-`.mcp.json` path (Assistant later)

Not this PR.

1. Catalog pin exists: `gitnexus@atebites-plugins` (`0.1.0` wrap;
   MCP `gitnexus@1.6.7`).
2. Assistant seats project-factory via host `enabledPlugins` (or
   equivalent) pointing at that catalog id.
3. Then remove or stop relying on template-only `.mcp.json` so hosts
   do not **double-spawn** `npx gitnexus`.
4. Keep the pin at 1.6.7 unless a documented bump lands after smoke.

Do not edit project-factory from this catalog.

## Goal

Give the marketplace an **upcoming / P N** pinned MCP wrap for GitNexus
so Factory is not stuck on template-only npx, without promoting it,
without forking the monorepo, and without soft-passing GitNexus as
installed.

## Layout

```text
plugins/gitnexus/
  README.md                      # upcoming / not Factory-default / catalog-listed for pin install
  UPSTREAM.md                    # npm pin + no-fork rationale
  NOTICE                         # PolyForm-NC attribution (package not vendored)
  plugin.json                    # thin placeholder
  mcp.json                       # pinned npx command (Cursor / Grok)
  .mcp.json                      # same pin (Claude convention)
  .cursor-plugin/plugin.json
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
  .grok-plugin/plugin.json
  .zcode-plugin/plugin.json
```

No skills. No hooks. No secrets. No gitlink.

## In scope (this wrap PR)

- Binding spike doc at `docs/SPIKE-GITNEXUS.md`
- Thin host manifests + pinned `mcp.json` / `.mcp.json`
- `UPSTREAM.md` honesty (thin wrap; why not a full fork; 1.6.7 vs 1.6.11)
- Catalog listing for pin install (`gitnexus@atebites-plugins`)
- README / FORK-INDEX **Upcoming / P2 spike** mention only

## Out of scope

- **No Factory-default / `enabledPlugins` / template `.mcp.json` edits.**
- **No Superpowers / ponytail / Advisor / ODW / factory-policy pin bumps.**
- **No cyclomatic complexity gates.**
- **No invented secrets.**
- **No soft-pass.** Missing MCP is not "GitNexus works."
- **No Dogfood Cursor live QA / Lane B.**
- **No claim that GitNexus editor skills/hooks are installed.**
- **No full monorepo fork / gitlink / weekday sync.**
- **No CE / taskboard / j-space.**

## Catalog posture

Host `marketplace.json` files **list** `gitnexus` with non-default
wording, same class as factory-policy (pin install, not default).
MCP-only wrap is not awkward here: taskboard already ships `mcp.json`.
linear-tracking stays unlisted because it is an interim skill-body
vendor, not an MCP pin.

Catalog listing is **not** Factory seating. Root README must not add
Grok/Claude/Codex/ZCode install-all commands for `gitnexus`.

## This wrap vs later

**In this PR (thin wrap, still Upcoming / P N):**

- Spike doc + plugin README labeled SPIKE / upcoming / **P N** / not Factory-default
- Pinned `gitnexus@1.6.7` MCP command
- `UPSTREAM.md` + no-fork table
- Catalog row for pin install
- README / FORK-INDEX **Upcoming / P2 spike** mention only

**Later (not this PR):**

- Assistant template `.mcp.json` replacement / `enabledPlugins`
- Optional pin bump to 1.6.11 after smoke
- True-fork + weekday sync only if license/shape allows
- Factory-default promotion
- Lane B with Jay credentials

## Success for this wrap

PR with this doc + wrap plugin + UPSTREAM honesty; Upcoming / **P N** /
not Factory default / catalog-listed for pin install; pin **1.6.7**;
no Factory kept-list entry; no invented secrets; not merged as a
Factory default; no Lane B claim.
