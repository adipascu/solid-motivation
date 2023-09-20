/* eslint-disable no-undef */
import { Temporal } from "temporal-polyfill";
import calculateAge from "./calculate-age";

describe("calculateAge", () => {
  it("calculates age correctly", () => {
    const birthDate = Temporal.PlainDate.from("2000-01-01");
    const now = Temporal.Instant.from("2019-12-31T23:00:00Z");
    expect(calculateAge(birthDate, now)).toBe(20);
  });
});
