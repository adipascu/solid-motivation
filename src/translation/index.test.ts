import { describe, expect, it, vi } from "vitest";
import { Temporal } from "temporal-polyfill";

const BIRTH_DAY = Temporal.PlainDate.from("1990-05-04");

const TRANSLATIONS = [
  { language: "en", age: "Age", birthDayLabel: "Birthday: " },
  { language: "ru", age: "Возраст", birthDayLabel: "День рождения: " },
  { language: "uk", age: "Вік", birthDayLabel: "День народження: " },
  { language: "cs", age: "Stáří", birthDayLabel: "Narozeniny: " },
  { language: "de", age: "Alter", birthDayLabel: "Geburtstag: " },
  { language: "pt", age: "Idade", birthDayLabel: "Aniversário: " },
  { language: "fr", age: "Âge", birthDayLabel: "Anniversaire : " },
  { language: "zh", age: "年龄", birthDayLabel: "生日：" },
  { language: "pl", age: "Wiek", birthDayLabel: "Data urodzenia: " },
  { language: "es", age: "Edad", birthDayLabel: "Fecha de nacimiento: " },
  { language: "sv", age: "Ålder", birthDayLabel: "Födelsedag: " },
  { language: "he", age: "גיל", birthDayLabel: "יום ההולדת: " },
];

const loadTranslation = async (preferredLanguages: string[]) => {
  Object.defineProperty(window.navigator, "languages", {
    configurable: true,
    value: preferredLanguages,
  });
  vi.resetModules();
  return import("./index");
};

describe.each(TRANSLATIONS)(
  "the $language translation",
  ({ language, age, birthDayLabel }) => {
    it("is chosen for a browser that prefers it", async () => {
      const { AGE, BIRTH_DAY_FORMAT } = await loadTranslation([
        `${language}-XX`,
      ]);
      expect(AGE).toBe(age);
      expect(BIRTH_DAY_FORMAT(BIRTH_DAY)).toBe(
        `${birthDayLabel}${BIRTH_DAY.toLocaleString()}`,
      );
    });

    it("carries every string the interface needs", async () => {
      const translation = await loadTranslation([language]);
      expect(
        [
          translation.AGE,
          translation.SOURCE_CODE,
          translation.COPY_LABEL,
          translation.AGE_COPIED,
          translation.AGE_COPY_FAILED,
          translation.ENTER_BIRTHDAY,
          translation.MOTIVATE,
          translation.RATE_APP,
        ].filter((text) => text.length === 0),
      ).toEqual([]);
    });
  },
);

describe("picking a translation", () => {
  it("takes the first preference the extension has been translated into", async () => {
    const { AGE } = await loadTranslation(["ja-JP", "de-DE", "fr-FR"]);
    expect(AGE).toBe("Alter");
  });

  it("falls back to English for a language nobody has translated", async () => {
    const { AGE } = await loadTranslation(["ja-JP"]);
    expect(AGE).toBe("Age");
  });

  it("falls back to English when the browser states no preference", async () => {
    const { AGE } = await loadTranslation([]);
    expect(AGE).toBe("Age");
  });
});
