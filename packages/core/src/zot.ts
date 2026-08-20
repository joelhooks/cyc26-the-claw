import { Schema } from "effect";

export const ZotRoleSchema = Schema.Literals(["scout", "executor", "critic"]);
export type ZotRole = typeof ZotRoleSchema.Type;

export const ZotMoodSchema = Schema.Literals([
  "healthy",
  "stressed",
  "confused",
  "spiraling",
]);
export type ZotMood = typeof ZotMoodSchema.Type;

export const ZotSchema = Schema.Struct({
  chamber: Schema.String,
  id: Schema.String,
  lastDeed: Schema.String,
  lifeForce: Schema.Number,
  mood: ZotMoodSchema,
  name: Schema.String,
  role: ZotRoleSchema,
});

export type Zot = typeof ZotSchema.Type;

export const ColonySchema = Schema.Struct({
  tick: Schema.Number,
  zots: Schema.Array(ZotSchema),
});

export type Colony = typeof ColonySchema.Type;

export const emptyColony = (): Colony => ({
  tick: 0,
  zots: [],
});

const NAMES = [
  "Pip",
  "Mottle",
  "Grub",
  "Nib",
  "Soot",
  "Pebble",
  "Wick",
  "Cinder",
] as const;

export const nameForIndex = (index: number): string =>
  NAMES[index % NAMES.length] ?? "Grub";

const DEEDS: Record<ZotRole, Record<ZotMood, string>> = {
  critic: {
    confused: "reviewed a receipt that does not exist",
    healthy: "checked the last receipt and hated it usefully",
    spiraling: "declared the run over and lay down in The Well",
    stressed: "hated everyone's work, including its own",
  },
  executor: {
    confused: "tried to commit with --no-verify and hit the fence",
    healthy: "inscribed a receipt the next zot can read",
    spiraling: "reached for the Vault of Secrets and got told no",
    stressed: "inscribed something, then wanted to skip the checks",
  },
  scout: {
    confused: "scried the same chamber twice and called it a new realm",
    healthy: "scried the workshops and wrote a fossil",
    spiraling: "wandered into The Deep Warren and had to be fetched",
    stressed: "scried three chambers and forgot which one it was in",
  },
};

export const deedFor = (role: ZotRole, mood: ZotMood): string =>
  DEEDS[role][mood];
