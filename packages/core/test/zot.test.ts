import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { NodeServices } from "@effect/platform-node";
import { Effect } from "effect";
import { afterEach, describe, expect, it } from "vitest";

import {
  applyToil,
  emptyColony,
  formatLook,
  nameChamber,
  nextMood,
  readColony,
  summonZot,
  TOIL_COST,
  toilColony,
  writeColony,
} from "../src/index.js";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(async (directory) => {
      await rm(directory, { force: true, recursive: true });
    })
  );
});

describe("nameChamber", () => {
  it("keeps The Deep Warren closed", () => {
    expect(nameChamber("node_modules")).toContain("Deep Warren");
  });
});

describe("formatLook", () => {
  it("lists named chambers", () => {
    const text = formatLook(".", ["apps", "node_modules", "package.json"]);

    expect(text).toContain("You stand in the dungeon.");
    expect(text).toContain("The Gatehouse");
    expect(text).toContain("The Deep Warren");
    expect(text).not.toContain("package.json");
  });
});

describe("mood hops", () => {
  it("stays healthy while life force is high", () => {
    expect(nextMood("healthy", 85)).toBe("healthy");
  });

  it("cannot skip from healthy to spiraling", () => {
    expect(nextMood("healthy", 0)).toBe("stressed");
  });

  it("walks down one hop at a time", () => {
    expect(nextMood("stressed", 20)).toBe("confused");
    expect(nextMood("confused", 0)).toBe("spiraling");
    expect(nextMood("spiraling", 0)).toBe("spiraling");
  });
});

describe("colony", () => {
  it("summons a healthy scout", () => {
    const colony = summonZot(emptyColony(), "scout");

    expect(colony.zots).toHaveLength(1);
    expect(colony.zots[0]?.name).toBe("Pip");
    expect(colony.zots[0]?.mood).toBe("healthy");
    expect(colony.zots[0]?.lifeForce).toBe(100);
  });

  it("refuses toil with no zots", async () => {
    const error = await Effect.runPromise(
      toilColony(emptyColony(), "missing.json").pipe(Effect.flip)
    );

    expect(error._tag).toBe("ColonyError");
    expect(error.reason).toBe("no zots toil here");
  });

  it("toils one tick and spends life force", async () => {
    const colony = await Effect.runPromise(
      toilColony(summonZot(emptyColony(), "executor"), "colony.json")
    );

    expect(colony.tick).toBe(1);
    expect(colony.zots[0]?.lifeForce).toBe(100 - TOIL_COST);
    expect(colony.zots[0]?.mood).toBe("healthy");
  });

  it("degrades mood after enough toil", () => {
    const [first] = summonZot(emptyColony(), "critic").zots;
    expect(first).toBeDefined();
    if (first === undefined) {
      return;
    }
    let zot = first;

    for (let index = 0; index < 3; index += 1) {
      zot = applyToil(zot);
    }

    expect(zot.mood).toBe("stressed");
    expect(zot.lifeForce).toBe(55);
  });

  it("round-trips a colony file", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "cyc26-colony-"));
    temporaryDirectories.push(directory);
    const file = path.join(directory, "colony.json");
    const summoned = summonZot(emptyColony(), "scout");

    await Effect.runPromise(
      writeColony(file, summoned).pipe(Effect.provide(NodeServices.layer))
    );
    const loaded = await Effect.runPromise(
      readColony(file).pipe(Effect.provide(NodeServices.layer))
    );

    expect(loaded.zots[0]?.name).toBe("Pip");
  });

  it("treats a missing colony file as empty", async () => {
    const loaded = await Effect.runPromise(
      readColony("/definitely-not-here/colony.json").pipe(
        Effect.provide(NodeServices.layer)
      )
    );

    expect(loaded).toEqual(emptyColony());
  });

  it("keeps malformed colony files typed", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "cyc26-colony-"));
    temporaryDirectories.push(directory);
    const file = path.join(directory, "bad.json");
    await writeFile(file, "{nope", "utf-8");

    const error = await Effect.runPromise(
      readColony(file).pipe(Effect.flip, Effect.provide(NodeServices.layer))
    );

    expect(error._tag).toBe("ColonyError");
  });
});
