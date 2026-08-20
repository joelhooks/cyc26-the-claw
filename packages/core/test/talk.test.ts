import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { NodeServices } from "@effect/platform-node";
import { Effect, Schema } from "effect";
import { afterEach, describe, expect, it } from "vitest";

import { formatTalkSlot, readTalkSlot, TalkSlotSchema } from "../src/index.js";

const temporaryDirectories: string[] = [];

const sample = {
  abstract: "Draft abstract for tests.",
  abstractStatus: "draft" as const,
  conference: "Commit Your Code 2026",
  date: "2026-09-04",
  time: "2:00–2:25 pm",
  title: "The Claw: Minions of Toil",
  track: "AI",
  venue: "Capital One Campus, Plano",
};

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(async (directory) => {
      await rm(directory, { force: true, recursive: true });
    })
  );
});

describe("TalkSlotSchema", () => {
  it("accepts a complete slot", () => {
    expect(Schema.decodeUnknownSync(TalkSlotSchema)(sample)).toEqual(sample);
  });

  it("rejects a missing abstract", () => {
    expect(() =>
      Schema.decodeUnknownSync(TalkSlotSchema)({
        ...sample,
        abstract: undefined,
      })
    ).toThrow();
  });
});

describe("formatTalkSlot", () => {
  it("prints title, slot, and abstract status", () => {
    const text = formatTalkSlot(sample);

    expect(text).toContain("The Claw: Minions of Toil");
    expect(text).toContain("abstract: draft");
    expect(text).toContain("Draft abstract for tests.");
  });
});

describe("readTalkSlot", () => {
  it("decodes a well-formed JSON file", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "cyc26-the-claw-"));
    temporaryDirectories.push(directory);
    const file = path.join(directory, "talk.json");
    await writeFile(file, `${JSON.stringify(sample)}\n`, "utf-8");

    const slot = await Effect.runPromise(
      readTalkSlot(file).pipe(Effect.provide(NodeServices.layer))
    );

    expect(slot.title).toBe(sample.title);
    expect(slot.abstractStatus).toBe("draft");
  });

  it("keeps JSON and schema failures typed", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "cyc26-the-claw-"));
    temporaryDirectories.push(directory);
    const file = path.join(directory, "bad.json");
    await writeFile(file, "{not-json", "utf-8");

    const error = await Effect.runPromise(
      readTalkSlot(file).pipe(Effect.flip, Effect.provide(NodeServices.layer))
    );

    expect(error._tag).toBe("TalkSlotError");
  });

  it("keeps filesystem failures typed", async () => {
    const error = await Effect.runPromise(
      readTalkSlot("/definitely-not-here/talk.json").pipe(
        Effect.flip,
        Effect.provide(NodeServices.layer)
      )
    );

    expect(error._tag).toBe("TalkSlotError");
  });
});
