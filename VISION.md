# Vision

This repo is the working tree for Joel's Commit Your Code 2026 talk, **The Claw: Minions of Toil**. It is also a clone of `joelhooks/ts-cli-template`, because the talk's claim is that swarms only produce durable results when the software they work on already has a floor.

Public GitHub is a steal-the-ideas surface. It is not a product to support.

**Scope:** `joelhooks/cyc26-the-claw` — talk materials, a typed talk slot, and the fence the talk is about.

**Audience:** Joel, agents working this talk, and anyone who clones the floor. Not a support queue.

## Who we serve

- Primary: Joel preparing and delivering the CYC26 talk
- Secondary: agents editing the abstract, slot, or talk notes
- Not for: shipping The Claw course, hosting JoelClaw, or a general TypeScript tutorial brand

## Why it exists

Agents take the shortest path. A swarm without a floor produces sludge at scale. This repo exists so the talk has:

1. Why — this file and `AGENTS.md`
2. Fence — pins, `pnpm check`, lefthook, hooks that block `--no-verify`
3. A real Effect CLI that prints a Schema-decoded talk slot from `data/talk.json`

The stack is the load-bearing floor. The talk is the product.

## Outcomes

- The official title stays **The Claw: Minions of Toil**
- The abstract lives in `data/talk.json` as `draft` until Joel marks it `submitted`
- Cascadia (swarms / harness) and the AIE Loopcraft workshop (reliability floor) are source talks, not this talk replayed
- JoelClaw and The Claw course supply the claw register. This repo does not copy private course design
- Cheap path stays the honest path: typed boundaries, loud failure, receipts

## Current priorities

1. Riff the abstract until it is short enough for a 25-minute CYC room
2. Keep the fence honest
3. Keep talk notes in `.brain/**/*.svx`

## Actors

- Beneficiary: Joel on stage in Plano, then anyone who clones the floor
- Builders: Joel and agents in this repo
- External systems: CYC agenda, Cascadia listing, AIE workshop site, `ts-cli-template`
- Not an audience: people expecting a finished game, a hosted claw, or support

## Merge by default

- Abstract and slot edits that stay Schema-valid
- Talk notes that keep source claims and Joel drafts distinct
- Fence and check fixes that do not weaken gates

## Needs sign-off

- Changing the public title
- Marking the abstract `submitted`
- Weakening lefthook, CI, or `--no-verify` blocks
- Pasting private course design, operator topology, or customer data into the public tree

## Will not do for now

- Rebuild The Claw course here
- Run JoelClaw from this repo
- Replay the full Cascadia or AIE workshop on stage
- Bun or npm as the install story

## Decision boundaries

- Safe by default: draft abstract riffs, Brain notes, small tested CLI fixes
- Needs owner sign-off: submitted copy, title change, fence weakening
- Evidence expected: `pnpm turbo run check test build` green; `pnpm cli talk data/talk.json` prints the current draft

## Amendment policy

This document changes when the talk thesis is wrong. Agents may propose amendments with receipts. Joel approves.
