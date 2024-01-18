import type { Temporal } from "temporal-polyfill";

export const AGE = "Alter";
export const SOURCE_CODE = "Quellcode";
export const COPY_LABEL =
  "Klicken Sie hier, um das Alter in die Zwischenablage zu kopieren";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Geburtstag: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Alter in Zwischenablage kopiert!";
export const AGE_COPY_FAILED =
  "Alter konnte nicht in die Zwischenablage kopiert werden!";
export const ENTER_BIRTHDAY = "Geben Sie Ihren Geburtstag ein";
export const MOTIVATE = "Motivieren";
