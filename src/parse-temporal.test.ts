import { describe, expect, it } from "vitest";
import { Temporal } from "temporal-polyfill";
import { parseInstant, parsePlainDate } from "./parse-temporal";

describe("parseInstant", () => {
  it("parses a stored instant string", () => {
    expect(parseInstant("2025-01-01T00:00:00Z")).toEqual(
      Temporal.Instant.from("2025-01-01T00:00:00Z"),
    );
  });

  it("returns null for a missing value", () => {
    expect(parseInstant(null)).toBeNull();
    expect(parseInstant(undefined)).toBeNull();
  });

  it("returns null for a non-string value", () => {
    expect(parseInstant(1735689600000)).toBeNull();
    expect(parseInstant(true)).toBeNull();
  });

  it("returns null for a corrupted value instead of throwing", () => {
    expect(parseInstant("not a date")).toBeNull();
    expect(parseInstant("")).toBeNull();
    expect(parseInstant("2025-13-45T99:99:99Z")).toBeNull();
  });
});

describe("parsePlainDate", () => {
  it("parses a calendar date", () => {
    expect(parsePlainDate("1990-06-15")).toEqual(
      Temporal.PlainDate.from("1990-06-15"),
    );
  });

  it("returns null for the empty value a cleared date input reports", () => {
    expect(parsePlainDate("")).toBeNull();
  });

  it("returns null for a missing value", () => {
    expect(parsePlainDate(null)).toBeNull();
    expect(parsePlainDate(undefined)).toBeNull();
  });

  it("returns null for a non-string value", () => {
    expect(parsePlainDate(19900615)).toBeNull();
  });

  it("returns null for an impossible date instead of throwing", () => {
    expect(parsePlainDate("1990-02-31")).toBeNull();
    expect(parsePlainDate("1990-13-01")).toBeNull();
    expect(parsePlainDate("not a date")).toBeNull();
  });
});
