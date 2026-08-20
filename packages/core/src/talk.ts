import { Effect, FileSystem, Runtime, Schema } from "effect";

export const AbstractStatusSchema = Schema.Literals(["draft", "submitted"]);

export const TalkSlotSchema = Schema.Struct({
  abstract: Schema.String,
  abstractStatus: AbstractStatusSchema,
  conference: Schema.String,
  date: Schema.String,
  time: Schema.String,
  title: Schema.String,
  track: Schema.String,
  venue: Schema.String,
});

export type TalkSlot = typeof TalkSlotSchema.Type;

export class TalkSlotError extends Schema.TaggedError<TalkSlotError>()(
  "TalkSlotError",
  {
    path: Schema.String,
    reason: Schema.String,
  }
) {
  override readonly [Runtime.errorExitCode] = 1;
  override readonly [Runtime.errorReported] = false;

  override get message(): string {
    return `Could not read talk slot ${this.path}: ${this.reason}`;
  }
}

export const formatTalkSlot = (slot: TalkSlot): string =>
  [
    slot.title,
    `${slot.conference} · ${slot.venue}`,
    `${slot.date} · ${slot.time} · ${slot.track}`,
    `abstract: ${slot.abstractStatus}`,
    "",
    slot.abstract,
  ].join("\n");

export const readTalkSlot = Effect.fn("TalkSlot.read")(function* readTalkSlot(
  path: string
) {
  const fileSystem = yield* FileSystem.FileSystem;
  const bytes = yield* fileSystem.readFile(path).pipe(
    Effect.mapError(
      (error) =>
        new TalkSlotError({
          path,
          reason: error.message,
        })
    )
  );
  const text = new TextDecoder().decode(bytes);
  const raw = yield* Effect.try({
    catch: (error) =>
      new TalkSlotError({
        path,
        reason: error instanceof Error ? error.message : String(error),
      }),
    try: () => JSON.parse(text) as unknown,
  });

  return yield* Schema.decodeUnknownEffect(TalkSlotSchema)(raw).pipe(
    Effect.mapError(
      (error) =>
        new TalkSlotError({
          path,
          reason: error.message,
        })
    )
  );
});
