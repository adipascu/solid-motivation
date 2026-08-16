import { Temporal } from "temporal-polyfill";
import { Effect } from "effect";

const parseOrNull = <A>(parse: () => A) =>
  Effect.runSync(Effect.try(parse).pipe(Effect.orElseSucceed(() => null)));

export const parseInstant = (value: unknown) =>
  typeof value === "string"
    ? parseOrNull(() => Temporal.Instant.from(value))
    : null;

export const parsePlainDate = (value: unknown) =>
  typeof value === "string"
    ? parseOrNull(() => Temporal.PlainDate.from(value))
    : null;
