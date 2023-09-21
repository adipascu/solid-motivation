import { Temporal } from "temporal-polyfill";
import { calculateAge } from "./calculate-age";

describe("calculateAge", () => {
  it("calculates age correctly for UTC", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.ZonedDateTime.from("2020-01-01T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(20);
  });

  it("calculates age correctly for New York (EST)", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.ZonedDateTime.from(
      "2020-01-01T00:00:00-05:00[America/New_York]",
    );
    expect(calculateAge(birthDate, now)).toBe(20);
  });

  it("calculates age correctly for Tokyo (JST)", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.ZonedDateTime.from(
      "2020-01-01T00:00:00+09:00[Asia/Tokyo]",
    );
    expect(calculateAge(birthDate, now)).toBe(20);
  });

  it("calculates age correctly for Auckland (NZDT)", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.ZonedDateTime.from(
      "2020-01-01T00:00:00+13:00[Pacific/Auckland]",
    );
    expect(calculateAge(birthDate, now)).toBe(20);
  });

  it("calculates age correctly for a leap year birthday", () => {
    const birthDate = Temporal.PlainDate.from("2000-02-29");
    const now = Temporal.ZonedDateTime.from("2021-02-28T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(21);

    const nextDay = Temporal.ZonedDateTime.from("2021-03-01T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, nextDay)).toBe(21.002739726027396);
  });

  it("calculates age correctly from leap year to leap year", () => {
    const birthDate = Temporal.PlainDate.from("2000-02-29");
    const now = Temporal.ZonedDateTime.from("2020-02-28T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(20);

    expect(
      calculateAge(
        birthDate,
        Temporal.ZonedDateTime.from("2024-02-28T12:00:00Z[UTC]"),
      ),
    ).toBe(24.0013698630137);

    const nextDay = Temporal.ZonedDateTime.from("2020-02-29T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, nextDay)).toBe(20);
  });

  it("calculates age correctly on leap day of a non-leap year", () => {
    const birthDate = Temporal.PlainDate.from("2000-02-29");
    const now = Temporal.ZonedDateTime.from("2023-02-28T23:59:59Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(23.002739694317604);
  });

  it("calculates age correctly within the same year", () => {
    const birthDate = Temporal.PlainDate.from("2023-01-01");
    const now = Temporal.ZonedDateTime.from("2023-06-15T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(0.4520547945205479);
  });

  it("calculates age correctly for oldest known human age", () => {
    const birthDate = Temporal.PlainDate.from("1875-08-04");
    const now = Temporal.ZonedDateTime.from("1997-08-04T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(122);
  });

  it("calculates age correctly for a date in the future", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.ZonedDateTime.from("2010-01-01T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(10);
  });

  it("calculates age correctly the day before birthday", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.ZonedDateTime.from("2019-12-31T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(19.997260273972604);
  });

  it("calculates age correctly the day after birthday", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.ZonedDateTime.from("2020-01-02T00:00:00Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(20.002732240437158);
  });

  it("calculates age correctly for random date in 2005", () => {
    const birthDate = Temporal.PlainDate.from("1987-06-15");
    const now = Temporal.ZonedDateTime.from("2005-09-12T10:30:45Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(18.245035673515982);
  });

  it("calculates age correctly for random date in 2015 with DST", () => {
    const birthDate = Temporal.PlainDate.from("1990-11-20");
    const now = Temporal.ZonedDateTime.from(
      "2015-03-28T14:00:00-07:00[America/Los_Angeles]",
    );
    expect(calculateAge(birthDate, now)).toBe(24.352168949771688);
  });

  it("calculates age correctly for random date in 2022", () => {
    const birthDate = Temporal.PlainDate.from("2001-02-05");
    const now = Temporal.ZonedDateTime.from("2022-02-04T23:59:59Z[UTC]");
    expect(calculateAge(birthDate, now)).toBe(20.999999968290208);
  });

  it("calculates age correctly for random date and time in 2030", () => {
    const birthDate = Temporal.PlainDate.from("2010-12-31");
    const now = Temporal.ZonedDateTime.from(
      "2030-01-01T05:45:30+11:00[Australia/Sydney]",
    );
    expect(calculateAge(birthDate, now)).toBe(19.00339707001522);
  });
});
