import { Temporal } from "temporal-polyfill";

export const calculateAge = (
  birthDay: Temporal.PlainDate,
  now: Temporal.Instant,
  rolloverTimezone: Temporal.TimeZone | Temporal.TimeZoneProtocol,
) => {
  const midnightInstant = birthDay
    .toZonedDateTime(rolloverTimezone)
    .toInstant();
  return now.since(midnightInstant).total({
    unit: "years",
    relativeTo: birthDay,
  });
};

export const calculateAgeLocal = (birthDay: Temporal.PlainDate) => {
  const localTime = Temporal.Now.instant();
  const localTimezone = Temporal.Now.timeZone();
  return calculateAge(birthDay, localTime, localTimezone);
};
