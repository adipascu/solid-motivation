import type { Temporal } from "temporal-polyfill";

export const AGE = "Stáří";
export const SOURCE_CODE = "zdrojový kód";
export const COPY_LABEL = "Kliknutím zkopírujete věk do schránky";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Narozeniny: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Věk zkopírován do schránky!";
export const AGE_COPY_FAILED = "Věk se nepodařilo zkopírovat do schránky!";
export const ENTER_BIRTHDAY = "Zadejte své narozeniny";
export const MOTIVATE = "Motivovat";
