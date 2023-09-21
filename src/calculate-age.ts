import { Temporal } from "temporal-polyfill";

export const calculateAge = (
  birthDay: Temporal.PlainDate,
  now: Temporal.ZonedDateTime,
) => {
  const midnightInstant = birthDay.toZonedDateTime(now.timeZone);
  return now.since(midnightInstant).total({
    unit: "years",
    relativeTo: midnightInstant,
  });
};

export const calculateAgeLocal = (birthDay: Temporal.PlainDate) => {
  const localTime = Temporal.Now.zonedDateTime("gregory");
  return calculateAge(birthDay.withCalendar("gregory"), localTime);
};
