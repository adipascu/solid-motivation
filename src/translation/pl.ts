import type { Temporal } from "temporal-polyfill";

export const AGE = "Wiek";
export const SOURCE_CODE = "kod źródłowy";
export const COPY_LABEL = "Kliknij, aby skopiować wiek do schowka";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Data urodzenia: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Wiek skopiowany do schowka!";
export const AGE_COPY_FAILED = "Nie udało się skopiować wieku do schowka!";
export const ENTER_BIRTHDAY = "Wprowadź swoją datę urodzenia";
export const MOTIVATE = "Motywuj";
