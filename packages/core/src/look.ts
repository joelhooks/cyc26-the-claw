import { Effect, FileSystem, Runtime, Schema } from "effect";

export class LookError extends Schema.TaggedError<LookError>()("LookError", {
  path: Schema.String,
  reason: Schema.String,
}) {
  override readonly [Runtime.errorExitCode] = 1;
  override readonly [Runtime.errorReported] = false;

  override get message(): string {
    return `Could not look at ${this.path}: ${this.reason}`;
  }
}

const CHAMBERS: Record<string, string> = {
  ".brain": "The Chronicle",
  ".env": "The Vault of Secrets (do not examine)",
  apps: "The Gatehouse",
  data: "The Well",
  node_modules: "The Deep Warren (best left undisturbed)",
  packages: "The Workshops",
  scripts: "The Ritual Hall",
};

export const nameChamber = (entry: string): string =>
  CHAMBERS[entry] ?? `The chamber of ${entry}`;

export const formatLook = (
  root: string,
  entries: readonly string[]
): string => {
  const visible = entries.filter((entry) => Object.hasOwn(CHAMBERS, entry));
  // lib is not es2023, so toSorted is unavailable. Sort a copy.
  // oxlint-disable-next-line unicorn/no-array-sort
  visible.sort((left, right) => left.localeCompare(right));
  const lines = visible.map((entry) => `- ${nameChamber(entry)}`);
  const place = root === "." || root === "" ? "the dungeon" : root;

  return [`You stand in ${place}.`, "", ...lines].join("\n");
};

export const lookAt = Effect.fn("Look.read")(function* lookAt(path: string) {
  const fileSystem = yield* FileSystem.FileSystem;
  const entries = yield* fileSystem.readDirectory(path).pipe(
    Effect.mapError(
      (error) =>
        new LookError({
          path,
          reason: error.message,
        })
    )
  );

  return formatLook(path, entries);
});
