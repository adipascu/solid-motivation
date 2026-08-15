import { describe, expect, it } from "vitest";
import { Temporal } from "temporal-polyfill";
import { calculateAge, calculateAgeLocal } from "./calculate-age";

const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;

const bornOn = (date: string) => Temporal.PlainDate.from(date);
const at = (zonedDateTime: string) =>
  Temporal.ZonedDateTime.from(zonedDateTime);
const localMidnightOn = (date: string, timeZone: string) =>
  Temporal.PlainDate.from(date).toZonedDateTime(timeZone);

const sweep = (
  from: Temporal.ZonedDateTime,
  to: Temporal.ZonedDateTime,
  step: Temporal.DurationLike,
) => {
  const moments = [];
  let now = from;
  while (Temporal.ZonedDateTime.compare(now, to) < 0) {
    moments.push(now);
    now = now.add(step);
  }
  return moments;
};

describe("calculateAge", () => {
  describe("on a birthday", () => {
    it.each([
      { born: "2000-01-01", birthday: "2020-01-01", years: 20 },
      { born: "1875-08-04", birthday: "1997-08-04", years: 122 },
      { born: "2010-12-31", birthday: "2029-12-31", years: 19 },
      { born: "2023-01-01", birthday: "2024-01-01", years: 1 },
    ])(
      "born $born is exactly $years at midnight on $birthday",
      ({ born, birthday, years }) => {
        expect(
          calculateAge(bornOn(born), localMidnightOn(birthday, "UTC")),
        ).toBe(years);
      },
    );
  });

  describe("between birthdays", () => {
    it.each([
      {
        elapsed: "one day into a 366 day year",
        born: "2000-01-01",
        now: "2020-01-02T00:00:00Z[UTC]",
        expected: 20 + 1 / 366,
      },
      {
        elapsed: "one day short of a birthday",
        born: "2000-01-01",
        now: "2019-12-31T00:00:00Z[UTC]",
        expected: 19 + 364 / 365,
      },
      {
        elapsed: "one second short of a birthday",
        born: "2001-02-05",
        now: "2022-02-04T23:59:59Z[UTC]",
        expected: 20 + (365 * SECONDS_PER_DAY - 1) / (365 * SECONDS_PER_DAY),
      },
      {
        elapsed: "165 days into a first year of life",
        born: "2023-01-01",
        now: "2023-06-15T00:00:00Z[UTC]",
        expected: 165 / 365,
      },
      {
        elapsed: "a day and a fraction into a birthday year",
        born: "2010-12-31",
        now: "2030-01-01T05:45:30+11:00[Australia/Sydney]",
        expected:
          19 +
          (SECONDS_PER_DAY + 5 * SECONDS_PER_HOUR + 45 * 60 + 30) /
            (365 * SECONDS_PER_DAY),
      },
      {
        elapsed: "89 days and a fraction into a birthday year",
        born: "1987-06-15",
        now: "2005-09-12T10:30:45Z[UTC]",
        expected:
          18 +
          (89 * SECONDS_PER_DAY + 10 * SECONDS_PER_HOUR + 30 * 60 + 45) /
            (365 * SECONDS_PER_DAY),
      },
    ])("is $elapsed", ({ born, now, expected }) => {
      expect(calculateAge(bornOn(born), at(now))).toBe(expected);
    });
  });

  describe("time zones", () => {
    it.each([
      "UTC",
      "America/New_York",
      "Asia/Tokyo",
      "Pacific/Auckland",
      "Australia/Sydney",
    ])("reaches a whole number at local midnight in %s", (timeZone) => {
      expect(
        calculateAge(
          bornOn("2000-01-01"),
          localMidnightOn("2020-01-01", timeZone),
        ),
      ).toBe(20);
    });

    it("measures from local midnight, so one instant gives different ages", () => {
      const born = bornOn("2000-01-01");
      const instant = Temporal.Instant.from("2020-01-01T00:00:00Z");

      expect(
        calculateAge(born, instant.toZonedDateTimeISO("Asia/Tokyo")),
      ).toBeGreaterThan(20);
      expect(
        calculateAge(born, instant.toZonedDateTimeISO("America/New_York")),
      ).toBeLessThan(20);
    });
  });

  describe("daylight saving", () => {
    it("loses an hour of elapsed time to a spring forward", () => {
      expect(
        calculateAge(
          bornOn("1990-11-20"),
          at("2015-03-28T14:00:00-07:00[America/Los_Angeles]"),
        ),
      ).toBe(
        24 +
          (128 * SECONDS_PER_DAY + 13 * SECONDS_PER_HOUR) /
            (365 * SECONDS_PER_DAY),
      );
    });

    it("copes with a birthday whose local midnight never happens", () => {
      const skippedMidnight = localMidnightOn("2019-09-08", "America/Santiago");

      expect(skippedMidnight.hour).toBe(1);
      expect(calculateAge(bornOn("2000-09-08"), skippedMidnight)).toBeCloseTo(
        19,
        3,
      );
    });
  });

  describe("a 29 February birthday", () => {
    const leapling = bornOn("2000-02-29");

    it("turns 20 on 29 February of a leap year", () => {
      expect(calculateAge(leapling, localMidnightOn("2020-02-29", "UTC"))).toBe(
        20,
      );
    });

    it("is not yet 20 on 28 February of that leap year", () => {
      expect(calculateAge(leapling, localMidnightOn("2020-02-28", "UTC"))).toBe(
        19 + 365 / 366,
      );
    });

    it("turns 21 on 28 February of a common year", () => {
      expect(calculateAge(leapling, localMidnightOn("2021-02-28", "UTC"))).toBe(
        21,
      );
    });

    it("is a day past 21 on 1 March of that common year", () => {
      expect(calculateAge(leapling, localMidnightOn("2021-03-01", "UTC"))).toBe(
        21 + 1 / 365,
      );
    });

    it("measures against a 366 day year when the next birthday is a leap day", () => {
      expect(calculateAge(leapling, at("2023-02-28T23:59:59Z[UTC]"))).toBe(
        23 + (SECONDS_PER_DAY - 1) / (366 * SECONDS_PER_DAY),
      );
    });

    it("is half a day short of 24 at noon on 28 February 2024", () => {
      expect(calculateAge(leapling, at("2024-02-28T12:00:00Z[UTC]"))).toBe(
        23 + 365.5 / 366,
      );
    });
  });

  describe("counting continuously", () => {
    const leapling = bornOn("2000-02-29");

    it.each([
      { window: "a leap day birthday", from: "2020-02-26", timeZone: "UTC" },
      { window: "a common year birthday", from: "2021-02-26", timeZone: "UTC" },
      {
        window: "a spring forward",
        from: "2021-03-12",
        timeZone: "America/New_York",
      },
      {
        window: "a fall back",
        from: "2021-11-05",
        timeZone: "America/New_York",
      },
    ])("never counts backwards across $window", ({ from, timeZone }) => {
      const start = localMidnightOn(from, timeZone);
      const moments = sweep(start, start.add({ days: 5 }), { minutes: 30 });
      const ages = moments.map((now) => calculateAge(leapling, now));

      expect(ages.length).toBeGreaterThan(200);
      ages.slice(1).forEach((age, index) => {
        expect(age).toBeGreaterThan(ages[index]);
      });
    });

    it("lands on a whole number at local midnight on 30 consecutive birthdays", () => {
      for (let year = 2001; year <= 2030; year += 1) {
        const celebration = Temporal.PlainDate.from({
          year,
          month: 2,
          day: 29,
        });

        expect(
          calculateAge(
            leapling,
            celebration.toZonedDateTime("Pacific/Auckland"),
          ),
        ).toBe(year - 2000);
      }
    });
  });
});

describe("calculateAgeLocal", () => {
  it("agrees with calculateAge in the system time zone", () => {
    const born = bornOn("2000-01-01");
    const reference = calculateAge(
      born.withCalendar("gregory"),
      Temporal.Now.zonedDateTimeISO().withCalendar("gregory"),
    );

    expect(calculateAgeLocal(born)).toBeCloseTo(reference, 6);
  });
});
