# The Claw: Minions of Toil

Working repo for Joel's [Commit Your Code 2026](https://www.commityourcode.com/) talk.

Scaffolded from [`joelhooks/ts-cli-template`](https://github.com/joelhooks/ts-cli-template). The clone is the point: swarms need a floor.

```sh
pnpm install
pnpm cli talk data/talk.json
pnpm cli look
pnpm cli summon --role scout
pnpm cli toil
```

## Slot

- **Title:** The Claw: Minions of Toil
- **When:** Friday 2026-09-04, 2:00–2:25 pm
- **Where:** Capital One Campus, Plano · AI track
- **Abstract:** draft in `data/talk.json` — riff in `.brain/projects/abstract.svx`

## What this repo is

A typed talk slot and the fence the talk is about. Effect Schema reads `data/talk.json`. Bad input fails loud. Checks and hooks make `--no-verify` die.

It is not The Claw course. It is not JoelClaw. Those are related claws. Sources live in `.brain/resources/claw-lineage.svx`.

## Workspace

| Path             | Package                | Role                   |
| ---------------- | ---------------------- | ---------------------- |
| `apps/cli`       | `@cyc26-the-claw/cli`  | Effect CLI entry       |
| `packages/core`  | `@cyc26-the-claw/core` | Talk slot + zot colony |
| `data/talk.json` | —                      | Slot + draft abstract  |
| `.brain/`        | —                      | Talk notes             |

## What is in the stack?

Same floor as the template:

- pnpm workspaces + Turborepo
- Effect v4 + `@effect/platform-node`
- TypeScript 7 strict
- XState 5
- Oxlint + Ultracite + Oxfmt
- Vitest
- Lefthook + agent hooks that block `git … --no-verify`

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm check` | Typecheck, format check, type-aware lint |
| `pnpm test` | Vitest once |
| `pnpm build` | Compile packages |
| `pnpm cli talk data/talk.json` | Print the slot and draft abstract |
| `pnpm cli look` | Examine this repo as a dungeon |
| `pnpm cli summon --role scout` | Summon a zot |
| `pnpm cli toil` | Advance one tick |
| `pnpm cli talk data/talk.json --json` | Machine-readable slot |
| `pnpm turbo run check test build` | Full gate |

## Related

- [CascadiaJS 2026 — AI Agent Swarms Are Amazing](https://cascadiajs.com/2026/talks/ai-agent-swarms-are-amazing)
- [AIE Loopcraft Workshop 2026](https://aie-loopcraft-workshop-2026.wzrrd.sh/)
- [`joelhooks/ts-cli-template`](https://github.com/joelhooks/ts-cli-template)

## License

MIT
