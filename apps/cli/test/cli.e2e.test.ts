import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const cliDir = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(cliDir, "../..");
const cliPath = path.join(cliDir, "dist", "cli.js");
const talkPath = path.join(repoRoot, "data", "talk.json");
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(async (directory) => {
      await rm(directory, { force: true, recursive: true });
    })
  );
});

const runCli = (arguments_: readonly string[]) =>
  spawnSync(process.execPath, [cliPath, ...arguments_], {
    cwd: repoRoot,
    encoding: "utf-8",
  });

describe("built CLI", () => {
  it("prints help and exits cleanly", () => {
    const result = runCli(["--help"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("USAGE");
    expect(result.stdout).toContain("talk");
    expect(result.stdout).toContain("summon");
  });

  it("looks at the dungeon", () => {
    const result = runCli(["look", repoRoot]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("The Gatehouse");
    expect(result.stdout).toContain("The Deep Warren");
  });

  it("summons a zot and refuses empty toil", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "cyc26-cli-"));
    temporaryDirectories.push(directory);
    const colony = path.join(directory, "colony.json");

    const emptyToil = runCli(["toil", "--colony", colony]);
    expect(emptyToil.status).toBe(1);
    expect(`${emptyToil.stdout}${emptyToil.stderr}`).toContain(
      "no zots toil here"
    );

    const summoned = runCli([
      "summon",
      "--role",
      "executor",
      "--colony",
      colony,
    ]);
    expect(summoned.status).toBe(0);
    expect(summoned.stdout).toContain("Pip the executor");

    const toiled = runCli(["toil", "--colony", colony]);
    expect(toiled.status).toBe(0);
    expect(toiled.stdout).toContain("tick 1");
    expect(toiled.stdout).toContain("life 85");
  });

  it("prints the draft abstract and exits cleanly", () => {
    const result = runCli(["talk", talkPath]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("The Claw: Minions of Toil");
    expect(result.stdout).toContain("abstract: draft");
  });

  it("prints JSON and exits cleanly", () => {
    const result = runCli(["talk", talkPath, "--json"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"title": "The Claw: Minions of Toil"');
    expect(result.stdout).toContain('"abstractStatus": "draft"');
  });

  it("prints command help and exits one for invalid input", () => {
    const result = runCli(["talk", "this-file-does-not-exist.json"]);

    expect(result.status).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toContain("Path does not exist");
  });
});
