import type { Temporal } from "temporal-polyfill";

export const AGE = "Возраст";
export const SOURCE_CODE = "исходный код";
export const COPY_LABEL = "Нажмите, чтобы скопировать возраст в буфер обмена";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `День рождения: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Возраст скопирован в буфер обмена!";
export const AGE_COPY_FAILED = "Не удалось скопировать возраст в буфер обмена!";
export const ENTER_BIRTHDAY = "Введите свой день рождения";
export const MOTIVATE = "Мотивировать";
