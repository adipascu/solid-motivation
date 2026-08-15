import { Temporal } from "temporal-polyfill";

export const parseInstant = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }
  try {
    return Temporal.Instant.from(value);
  } catch {
    return null;
  }
};

export const parsePlainDate = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }
  try {
    return Temporal.PlainDate.from(value);
  } catch {
    return null;
  }
};
