#!/usr/bin/env node

import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { Console, Effect } from "effect";

import { runCommand } from "./command.js";

const program = runCommand(process.argv.slice(2)).pipe(
  // Oxlint mistakes these Effect handlers for async Promise callbacks.
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  Effect.catchTag("TalkSlotError", (error) =>
    Console.error(error.message).pipe(Effect.andThen(Effect.fail(error)))
  ),
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  Effect.catchTag("ColonyError", (error) =>
    Console.error(error.message).pipe(Effect.andThen(Effect.fail(error)))
  ),
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  Effect.catchTag("LookError", (error) =>
    Console.error(error.message).pipe(Effect.andThen(Effect.fail(error)))
  ),
  Effect.provide(NodeServices.layer)
);

NodeRuntime.runMain(program);
