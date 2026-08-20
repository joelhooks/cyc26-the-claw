import { createActor, createMachine } from "xstate";

import type { Zot, ZotMood } from "./zot.js";
import { deedFor } from "./zot.js";

export const TOIL_COST = 15;

const moodMachine = createMachine({
  context: { lifeForce: 100 },
  id: "zot-mood",
  initial: "healthy",
  states: {
    confused: {
      on: {
        TOIL: {
          guard: ({ context }) => context.lifeForce < 10,
          target: "spiraling",
        },
      },
    },
    healthy: {
      on: {
        TOIL: {
          guard: ({ context }) => context.lifeForce < 60,
          target: "stressed",
        },
      },
    },
    spiraling: {},
    stressed: {
      on: {
        TOIL: {
          guard: ({ context }) => context.lifeForce < 30,
          target: "confused",
        },
      },
    },
  },
});

/**
 * Advance one mood hop for the current life force.
 * A zot cannot skip from healthy to spiraling in a single tick.
 */
export const nextMood = (mood: ZotMood, lifeForce: number): ZotMood => {
  const actor = createActor(moodMachine, {
    snapshot: moodMachine.resolveState({
      context: { lifeForce },
      value: mood,
    }),
  });
  actor.start();
  actor.send({ type: "TOIL" });
  const { value } = actor.getSnapshot();
  actor.stop();

  switch (value) {
    case "confused": {
      return value;
    }
    case "healthy": {
      return value;
    }
    case "spiraling": {
      return value;
    }
    case "stressed": {
      return value;
    }
    default: {
      return mood;
    }
  }
};

export const applyToil = (zot: Zot): Zot => {
  const lifeForce = Math.max(0, zot.lifeForce - TOIL_COST);
  const mood = nextMood(zot.mood, lifeForce);

  return {
    ...zot,
    lastDeed: deedFor(zot.role, mood),
    lifeForce,
    mood,
  };
};
