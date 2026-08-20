import { Effect, FileSystem, Runtime, Schema } from "effect";

import { applyToil } from "./mood.js";
import { ColonySchema, deedFor, emptyColony, nameForIndex } from "./zot.js";
import type { Colony, Zot, ZotRole } from "./zot.js";

export class ColonyError extends Schema.TaggedError<ColonyError>()(
  "ColonyError",
  {
    path: Schema.String,
    reason: Schema.String,
  }
) {
  override readonly [Runtime.errorExitCode] = 1;
  override readonly [Runtime.errorReported] = false;

  override get message(): string {
    return `Colony ${this.path}: ${this.reason}`;
  }
}

export const readColony = Effect.fn("Colony.read")(function* readColony(
  path: string
) {
  const fileSystem = yield* FileSystem.FileSystem;
  const exists = yield* fileSystem.exists(path).pipe(
    Effect.mapError(
      (error) =>
        new ColonyError({
          path,
          reason: error.message,
        })
    )
  );

  if (!exists) {
    return emptyColony();
  }

  const bytes = yield* fileSystem.readFile(path).pipe(
    Effect.mapError(
      (error) =>
        new ColonyError({
          path,
          reason: error.message,
        })
    )
  );
  const text = new TextDecoder().decode(bytes);
  const raw = yield* Effect.try({
    catch: (error) =>
      new ColonyError({
        path,
        reason: error instanceof Error ? error.message : String(error),
      }),
    try: () => JSON.parse(text) as unknown,
  });

  return yield* Schema.decodeUnknownEffect(ColonySchema)(raw).pipe(
    Effect.mapError(
      (error) =>
        new ColonyError({
          path,
          reason: error.message,
        })
    )
  );
});

export const writeColony = Effect.fn("Colony.write")(function* writeColony(
  path: string,
  colony: Colony
) {
  const fileSystem = yield* FileSystem.FileSystem;
  yield* fileSystem
    .writeFileString(path, `${JSON.stringify(colony, null, 2)}\n`)
    .pipe(
      Effect.mapError(
        (error) =>
          new ColonyError({
            path,
            reason: error.message,
          })
      )
    );

  return colony;
});

export const summonZot = (colony: Colony, role: ZotRole): Colony => {
  const zot: Zot = {
    chamber: "The Gatehouse",
    id: `zot-${String(colony.zots.length + 1)}`,
    lastDeed: deedFor(role, "healthy"),
    lifeForce: 100,
    mood: "healthy",
    name: nameForIndex(colony.zots.length),
    role,
  };

  return {
    tick: colony.tick,
    zots: [...colony.zots, zot],
  };
};

export const toilColony = (
  colony: Colony,
  path: string
): Effect.Effect<Colony, ColonyError> => {
  if (colony.zots.length === 0) {
    return Effect.fail(
      new ColonyError({
        path,
        reason: "no zots toil here",
      })
    );
  }

  return Effect.succeed({
    tick: colony.tick + 1,
    zots: colony.zots.map((zot) => applyToil(zot)),
  });
};

export const formatColony = (colony: Colony): string => {
  if (colony.zots.length === 0) {
    return "The colony is empty. Summon a minion of toil.";
  }

  const lines = colony.zots.map(
    (zot) =>
      `${zot.name} the ${zot.role} · ${zot.mood} · life ${String(zot.lifeForce)} · ${zot.lastDeed}`
  );

  return [`tick ${String(colony.tick)}`, "", ...lines].join("\n");
};
