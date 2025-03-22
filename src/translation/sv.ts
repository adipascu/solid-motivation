import type { Temporal } from "temporal-polyfill";

export const AGE = "Ålder";
export const SOURCE_CODE = "källkod";
export const COPY_LABEL = "Klicka för att kopiera åldern till urklipp";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Födelsedag: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Åldern kopierades till urklipp!";
export const AGE_COPY_FAILED = "Kunde inte kopiera åldern till urklipp!";
export const ENTER_BIRTHDAY = "Ange din födelsedag";
export const MOTIVATE = "Motivera";
