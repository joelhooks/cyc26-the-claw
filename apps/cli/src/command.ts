import { formatTalkSlot, readTalkSlot } from "@cyc26-the-claw/core";
import { Console, Effect } from "effect";
import { Argument, Command, Flag } from "effect/unstable/cli";

export const VERSION = "0.1.0";

const talkCommand = Command.make(
  "talk",
  {
    file: Argument.path("file", {
      mustExist: true,
      pathType: "file",
    }).pipe(Argument.withDescription("Talk slot JSON to read")),
    json: Flag.boolean("json").pipe(
      Flag.withDefault(false),
      Flag.withDescription("Print machine-readable JSON")
    ),
  },
  ({ file, json }) =>
    readTalkSlot(file).pipe(
      Effect.flatMap((slot) =>
        Console.log(json ? JSON.stringify(slot, null, 2) : formatTalkSlot(slot))
      )
    )
).pipe(Command.withDescription("Print the CYC26 talk slot and draft abstract"));

export const rootCommand = Command.make("the-claw").pipe(
  Command.withDescription("CYC26 talk working repo: The Claw: Minions of Toil"),
  Command.withSubcommands([talkCommand])
);

export const runCommand = Command.runWith(rootCommand, { version: VERSION });
