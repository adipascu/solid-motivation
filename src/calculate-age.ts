import { Temporal } from "temporal-polyfill";

export const calculateAge = (
  birthDay: Temporal.PlainDate,
  now: Temporal.ZonedDateTime,
) => {
  const midnightInstant = birthDay.toZonedDateTime(now.timeZone).toInstant();
  return now.toInstant().since(midnightInstant).total({
    unit: "years",
    relativeTo: birthDay,
  });
};

export const calculateAgeLocal = (birthDay: Temporal.PlainDate) => {
  const localTime = Temporal.Now.zonedDateTime("gregory");
  return calculateAge(birthDay.withCalendar("gregory"), localTime);
};
