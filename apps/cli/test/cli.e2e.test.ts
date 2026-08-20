import { spawnSync } from "node:child_process";
import path from "node:path";

import { describe, expect, it } from "vitest";

const cliDir = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(cliDir, "../..");
const cliPath = path.join(cliDir, "dist", "cli.js");
const talkPath = path.join(repoRoot, "data", "talk.json");

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
