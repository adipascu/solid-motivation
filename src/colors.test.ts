import { describe, expect, it, vi } from "vitest";
import { colorBackground, colorPrimary, colorSecondary } from "./colors";

const darkMode = vi.hoisted(() => ({ enabled: false }));

vi.mock("./dark-signal", () => ({ default: () => darkMode.enabled }));

describe("the light palette", () => {
  it("puts dark text on a white background", () => {
    darkMode.enabled = false;
    expect(colorPrimary()).toBe("#494949");
    expect(colorSecondary()).toBe("#b0b5b9");
    expect(colorBackground()).toBe("#ffffff");
  });
});

describe("the dark palette", () => {
  it("puts light text on a near-black background", () => {
    darkMode.enabled = true;
    expect(colorPrimary()).toBe("#bab4ab");
    expect(colorSecondary()).toBe("#b9b3aa");
    expect(colorBackground()).toBe("#181a1b");
  });
});
