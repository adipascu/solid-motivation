import { describe, expect, it } from "vitest";
import FONT_FAMILY from "./font";

describe("FONT_FAMILY", () => {
  it("falls back from the bundled Sen to Avenir and then to any sans-serif", () => {
    expect(FONT_FAMILY.split(",").map((font) => font.trim())).toEqual([
      "Sen",
      "Avenir",
      "sans-serif",
    ]);
  });
});
