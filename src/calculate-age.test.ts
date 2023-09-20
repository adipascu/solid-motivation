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
});
