import textDirection from "./text-direction";

describe("textDirection", () => {
  it("reports right to left for Hebrew", () => {
    expect(textDirection("he")).toBe("rtl");
  });

  it("reports right to left for other RTL scripts", () => {
    expect(textDirection("ar")).toBe("rtl");
    expect(textDirection("fa")).toBe("rtl");
    expect(textDirection("ur")).toBe("rtl");
  });

  it("reports left to right for the supported LTR languages", () => {
    for (const language of [
      "en",
      "ru",
      "uk",
      "cs",
      "de",
      "pt",
      "fr",
      "zh",
      "pl",
      "es",
      "sv",
    ]) {
      expect(textDirection(language)).toBe("ltr");
    }
  });

  it("ignores the region subtag", () => {
    expect(textDirection("he-IL")).toBe("rtl");
    expect(textDirection("en-GB")).toBe("ltr");
  });
});
