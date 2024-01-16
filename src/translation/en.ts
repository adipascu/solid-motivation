import type { Temporal } from "temporal-polyfill";

export const AGE = "Age";
export const SOURCE_CODE = "source code";
export const COPY_LABEL = "Click to copy age to clipboard";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Birthday: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Age copied to clipboard!";
export const AGE_COPY_FAILED = "Failed to copy age to clipboard!";
export const ENTER_BIRTHDAY = "Enter your Birthday";
export const MOTIVATE = "Motivate";
