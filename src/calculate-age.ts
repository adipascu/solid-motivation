import { Temporal } from "temporal-polyfill";

const midnightInstant = (date: Temporal.PlainDate) =>
  date.toZonedDateTime(Temporal.Now.timeZone()).toInstant();

const calculateAge = (birthDay: Temporal.PlainDate, now: Temporal.Instant) =>
  now.since(midnightInstant(birthDay)).total({
    unit: "years",
    relativeTo: birthDay,
  });

export default calculateAge;
