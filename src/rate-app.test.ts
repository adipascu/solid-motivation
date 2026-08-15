import { Temporal } from "temporal-polyfill";
import {
  earlierInstant,
  parseInstant,
  resolveInstallDate,
  shouldShowRateApp,
} from "./rate-app";

const instant = (value: string) => Temporal.Instant.from(value);
const zoned = (value: string) => Temporal.ZonedDateTime.from(value);

describe("parseInstant", () => {
  it("parses a stored instant string", () => {
    expect(parseInstant("2025-01-01T00:00:00Z")).toEqual(
      instant("2025-01-01T00:00:00Z"),
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

describe("earlierInstant", () => {
  it("keeps the known instant when the other is missing", () => {
    expect(earlierInstant(instant("2025-01-01T00:00:00Z"), null)).toEqual(
      instant("2025-01-01T00:00:00Z"),
    );
  });

  it("adopts the other instant when it is earlier", () => {
    expect(
      earlierInstant(
        instant("2025-06-01T00:00:00Z"),
        instant("2024-01-01T00:00:00Z"),
      ),
    ).toEqual(instant("2024-01-01T00:00:00Z"));
  });

  it("keeps the known instant when the other is later", () => {
    expect(
      earlierInstant(
        instant("2024-01-01T00:00:00Z"),
        instant("2025-06-01T00:00:00Z"),
      ),
    ).toEqual(instant("2024-01-01T00:00:00Z"));
  });

  it("keeps the known instant when both are equal", () => {
    expect(
      earlierInstant(
        instant("2025-01-01T00:00:00Z"),
        instant("2025-01-01T00:00:00Z"),
      ),
    ).toEqual(instant("2025-01-01T00:00:00Z"));
  });
});

describe("resolveInstallDate", () => {
  const now = instant("2025-06-01T00:00:00Z");

  it("stamps a first install in both stores", () => {
    expect(resolveInstallDate(null, null, now)).toEqual({
      installDate: now,
      updateLocal: true,
      updateCloud: true,
    });
  });

  it("adopts the synced date on a second device without clobbering it", () => {
    const cloud = instant("2024-01-01T00:00:00Z");
    expect(resolveInstallDate(null, cloud, now)).toEqual({
      installDate: cloud,
      updateLocal: true,
      updateCloud: false,
    });
  });

  it("seeds the cloud from a local date that predates syncing", () => {
    const local = instant("2024-01-01T00:00:00Z");
    expect(resolveInstallDate(local, null, now)).toEqual({
      installDate: local,
      updateLocal: false,
      updateCloud: true,
    });
  });

  it("writes nothing when both stores already agree", () => {
    const stored = instant("2024-01-01T00:00:00Z");
    expect(resolveInstallDate(stored, stored, now)).toEqual({
      installDate: stored,
      updateLocal: false,
      updateCloud: false,
    });
  });

  it("keeps the earliest date when the stores disagree", () => {
    const local = instant("2024-06-01T00:00:00Z");
    const cloud = instant("2024-01-01T00:00:00Z");
    expect(resolveInstallDate(local, cloud, now)).toEqual({
      installDate: cloud,
      updateLocal: true,
      updateCloud: false,
    });

    expect(resolveInstallDate(cloud, local, now)).toEqual({
      installDate: cloud,
      updateLocal: false,
      updateCloud: true,
    });
  });

  it("heals a stored date that is in the future", () => {
    const skewed = instant("2030-01-01T00:00:00Z");
    expect(resolveInstallDate(skewed, skewed, now)).toEqual({
      installDate: now,
      updateLocal: true,
      updateCloud: true,
    });
  });
});

describe("shouldShowRateApp", () => {
  it("hides the prompt for a fresh install", () => {
    expect(
      shouldShowRateApp(
        instant("2025-01-01T00:00:00Z"),
        zoned("2025-01-02T00:00:00Z[UTC]"),
        false,
      ),
    ).toBe(false);
  });

  it("hides the prompt just before three months", () => {
    expect(
      shouldShowRateApp(
        instant("2025-01-01T00:00:00Z"),
        zoned("2025-03-31T23:59:59Z[UTC]"),
        false,
      ),
    ).toBe(false);
  });

  it("shows the prompt at exactly three months", () => {
    expect(
      shouldShowRateApp(
        instant("2025-01-01T00:00:00Z"),
        zoned("2025-04-01T00:00:00Z[UTC]"),
        false,
      ),
    ).toBe(true);
  });

  it("shows the prompt long after three months", () => {
    expect(
      shouldShowRateApp(
        instant("2015-01-01T00:00:00Z"),
        zoned("2025-01-01T00:00:00Z[UTC]"),
        false,
      ),
    ).toBe(true);
  });

  it("hides the prompt once the app has been reviewed", () => {
    expect(
      shouldShowRateApp(
        instant("2015-01-01T00:00:00Z"),
        zoned("2025-01-01T00:00:00Z[UTC]"),
        true,
      ),
    ).toBe(false);
  });

  it("hides the prompt when the install date is in the future", () => {
    expect(
      shouldShowRateApp(
        instant("2026-01-01T00:00:00Z"),
        zoned("2025-01-01T00:00:00Z[UTC]"),
        false,
      ),
    ).toBe(false);
  });

  it("counts month ends without overflowing into a fourth month", () => {
    expect(
      shouldShowRateApp(
        instant("2025-11-30T00:00:00Z"),
        zoned("2026-02-28T00:00:00Z[UTC]"),
        false,
      ),
    ).toBe(true);

    expect(
      shouldShowRateApp(
        instant("2025-11-30T00:00:00Z"),
        zoned("2026-02-27T00:00:00Z[UTC]"),
        false,
      ),
    ).toBe(false);
  });

  it("measures months in the viewer time zone", () => {
    expect(
      shouldShowRateApp(
        instant("2025-01-01T00:00:00Z"),
        zoned("2025-04-01T09:00:00+09:00[Asia/Tokyo]"),
        false,
      ),
    ).toBe(true);

    expect(
      shouldShowRateApp(
        instant("2025-01-01T00:00:00Z"),
        zoned("2025-03-31T23:00:00+09:00[Asia/Tokyo]"),
        false,
      ),
    ).toBe(false);
  });
});
