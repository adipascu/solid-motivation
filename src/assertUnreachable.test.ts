import { describe, expect, it } from "vitest";
import assertUnreachable from "./assertUnreachable";

type Language = "en" | "de";

const describeLanguage = (language: Language) => {
  switch (language) {
    case "en":
      return "English";
    case "de":
      return "German";
    default:
      return assertUnreachable(language);
  }
};

const LANGUAGE_BY_CODE: Record<string, Language> = { en: "en", de: "de" };
Object.assign(LANGUAGE_BY_CODE, { fr: "fr" });

describe("assertUnreachable", () => {
  it("names the value that slipped past an exhaustive switch", () => {
    expect(() => describeLanguage(LANGUAGE_BY_CODE.fr)).toThrow(
      "This value is unsupported fr",
    );
  });

  it("names a value that is missing rather than unexpected", () => {
    expect(() => describeLanguage(LANGUAGE_BY_CODE.pt)).toThrow(
      "This value is unsupported undefined",
    );
  });
});
