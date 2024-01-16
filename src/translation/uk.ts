import type { Temporal } from "temporal-polyfill";

export const AGE = "Вік";
export const SOURCE_CODE = "вихідний код";
export const COPY_LABEL = "Натисніть, щоб скопіювати вік у буфер обміну";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `День народження: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Вік скопійовано в буфер обміну!";
export const AGE_COPY_FAILED = "Не вдалося скопіювати вік у буфер обміну!";
export const ENTER_BIRTHDAY = "Введіть свій день народження";
export const MOTIVATE = "Мотивуйте";
