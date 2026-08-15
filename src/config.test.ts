import { execSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { GIT_HASH } from "./config";

describe("GIT_HASH", () => {
  it("carries the commit the bundle was built from", () => {
    expect(GIT_HASH).toBe(
      execSync("git rev-parse --short HEAD").toString().trim(),
    );
  });
});
