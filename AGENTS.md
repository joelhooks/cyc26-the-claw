# Agent instructions

This file is the repo law. Read `VISION.md` before planning substantial work. `VISION.md` is not permission to bypass this file. Pi sessions also load `.pi/APPEND_SYSTEM.md` and `.pi/extensions/project.ts`.

## Stack contract

The pinned stack is declared in workspace `package.json` files and summarized in [README.md](./README.md#what-is-in-the-stack). Keep dependencies exact.

- pnpm workspaces + Turborepo (`apps/*`, `packages/*`)
- Node `>=24.18.0` and pnpm `11.3.0`; do not replace pnpm with Bun or npm for installs
- Effect `4.0.0-rc.110` and `@effect/platform-node` `4.0.0-rc.110`
- XState `5.32.5` for finite lifecycles
- TypeScript `7.0.2` in strict mode
- Oxlint `1.74.0` with Ultracite `7.9.4`, Oxfmt `0.59.0`, and Turborepo `2.10.5`

## Packages

| Package | Path | Role |
| --- | --- | --- |
| `@cyc26-the-claw/core` | `packages/core` | Talk slot, zot colony, mood machine |
| `@cyc26-the-claw/cli` | `apps/cli` | Effect CLI composition root |

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install workspace dependencies |
| `pnpm check` | Typecheck, verify formatting, and run type-aware linting |
| `pnpm fix` | Apply Oxfmt and safe Oxlint fixes |
| `pnpm test` | Build and run the Vitest suite once |
| `pnpm build` | Compile packages into `dist/` |
| `pnpm cli talk data/talk.json` | Print the current slot and draft abstract |
| `pnpm cli look` | Examine this repo as a dungeon |
| `pnpm cli summon --role scout` | Summon a zot into `data/colony.json` |
| `pnpm cli toil` | Advance one colony tick |
| `pnpm vendor:agent-sources` | Shallow-clone Effect, effect-solutions, and xstate mirrors |
| `pnpm turbo run check test build` | Required validation before claiming a change is ready |

## Fence (cheating is uncomfortable)

Why lives in `AGENTS.md` / `VISION.md`. The stack and hooks are the enforceable fence. Fence wins over prose.

- Lefthook pre-commit runs `pnpm check` and `pnpm test`
- Agents must not use `git … --no-verify` (or equivalent hook bypass)
- Blocked by: Pi `.pi/extensions/git-interceptor`, Cursor `.cursor/hooks.json`, Claude Code `.claude/settings.json`
- Policy source: `scripts/vcs-command-policy.js`

If a hook fails, fix the failure. Do not disable the fence.

## Source-first Effect / XState work

Before writing, reviewing, or refactoring Effect or XState code, inspect vendored source for the pinned versions:

```sh
pnpm vendor:agent-sources
```

| Need | Path |
| --- | --- |
| Effect Schema, Context.Service, CLI | `.agent_sources/github.com/Effect-TS/effect/` |
| Idiomatic Effect | `.agent_sources/github.com/kitlangton/effect-solutions/` |
| XState | `.agent_sources/github.com/statelyai/xstate/` |

## Project law

- Title stays **The Claw: Minions of Toil** unless Joel changes it.
- `data/talk.json` is the machine contract for the slot and abstract. Brain pages may riff; they do not silently diverge from the JSON without updating it.
- Keep `abstractStatus` at `draft` until Joel says the copy is submitted.
- Do not invent Joel's opinions, anecdotes, or stage stories. Flag gaps as `TODO` or `needs_source`.
- Do not copy private The Claw course design, operator topology, secrets, or customer data into this public tree.
- Cascadia and AIE are source talks. Do not paste those decks here as if this talk were a remount.

## Architecture

- Domain / shared library code lives in `packages/*`
- CLI composition root lives in `apps/cli`
- Talk notes live in `.brain/**/*.svx`
- Dependency direction: apps → packages → Effect/XState. Packages do not import apps.

## Boundaries and sign-off

- Safe by default: draft abstract riffs, Brain notes, tested CLI fixes that preserve the Schema
- Needs owner sign-off: submitted abstract, title change, fence weakening, public course-design dumps
