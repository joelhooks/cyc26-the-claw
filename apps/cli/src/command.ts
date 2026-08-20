import {
  formatColony,
  formatTalkSlot,
  lookAt,
  readColony,
  readTalkSlot,
  summonZot,
  toilColony,
  writeColony,
} from "@cyc26-the-claw/core";
import { Console, Effect } from "effect";
import { Argument, Command, Flag } from "effect/unstable/cli";

export const VERSION = "0.1.0";

const colonyFlag = Flag.path("colony", { pathType: "file" }).pipe(
  Flag.withDefault("data/colony.json"),
  Flag.withDescription("Colony JSON to read and write")
);

const jsonFlag = Flag.boolean("json").pipe(
  Flag.withDefault(false),
  Flag.withDescription("Print machine-readable JSON")
);

const talkCommand = Command.make(
  "talk",
  {
    file: Argument.path("file", {
      mustExist: true,
      pathType: "file",
    }).pipe(Argument.withDescription("Talk slot JSON to read")),
    json: jsonFlag,
  },
  ({ file, json }) =>
    readTalkSlot(file).pipe(
      Effect.flatMap((slot) =>
        Console.log(json ? JSON.stringify(slot, null, 2) : formatTalkSlot(slot))
      )
    )
).pipe(Command.withDescription("Print the CYC26 talk slot and draft abstract"));

const lookCommand = Command.make(
  "look",
  {
    dir: Argument.path("dir", {
      mustExist: true,
      pathType: "directory",
    }).pipe(
      Argument.withDefault("."),
      Argument.withDescription("Chamber to examine")
    ),
  },
  ({ dir }) => lookAt(dir).pipe(Effect.flatMap((text) => Console.log(text)))
).pipe(Command.withDescription("Examine the dungeon generated from this repo"));

const summonCommand = Command.make(
  "summon",
  {
    colony: colonyFlag,
    role: Flag.choice("role", ["scout", "executor", "critic"]).pipe(
      Flag.withDefault("scout"),
      Flag.withDescription("Zot role")
    ),
  },
  ({ colony, role }) =>
    readColony(colony).pipe(
      Effect.map((current) => summonZot(current, role)),
      Effect.tap((next) => writeColony(colony, next)),
      Effect.flatMap((next) => Console.log(formatColony(next)))
    )
).pipe(Command.withDescription("Summon a minion of toil"));

const toilCommand = Command.make(
  "toil",
  {
    colony: colonyFlag,
  },
  ({ colony }) =>
    readColony(colony).pipe(
      Effect.flatMap((current) => toilColony(current, colony)),
      Effect.tap((next) => writeColony(colony, next)),
      Effect.flatMap((next) => Console.log(formatColony(next)))
    )
).pipe(Command.withDescription("Advance one tick. Zots toil. Moods hop."));

const colonyCommand = Command.make(
  "colony",
  {
    colony: colonyFlag,
    json: jsonFlag,
  },
  ({ colony, json }) =>
    readColony(colony).pipe(
      Effect.flatMap((current) =>
        Console.log(
          json ? JSON.stringify(current, null, 2) : formatColony(current)
        )
      )
    )
).pipe(Command.withDescription("Show the colony"));

export const rootCommand = Command.make("the-claw").pipe(
  Command.withDescription("CYC26 talk working repo: The Claw: Minions of Toil"),
  Command.withSubcommands([
    talkCommand,
    lookCommand,
    summonCommand,
    toilCommand,
    colonyCommand,
  ])
);

export const runCommand = Command.runWith(rootCommand, { version: VERSION });
