import { Temporal } from "temporal-polyfill";

const RATE_APP_MIN_MONTHS = 3;

export const parseInstant = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }
  try {
    return Temporal.Instant.from(value);
  } catch {
    return null;
  }
};

export const earlierInstant = (
  instant: Temporal.Instant,
  other: Temporal.Instant | null,
) => {
  if (other === null) {
    return instant;
  }
  return Temporal.Instant.compare(other, instant) < 0 ? other : instant;
};

export const resolveInstallDate = (
  localInstallDate: Temporal.Instant | null,
  cloudInstallDate: Temporal.Instant | null,
  now: Temporal.Instant,
) => {
  const installDate = earlierInstant(
    earlierInstant(now, localInstallDate),
    cloudInstallDate,
  );
  return {
    installDate,
    updateLocal:
      localInstallDate === null || !localInstallDate.equals(installDate),
    updateCloud:
      cloudInstallDate === null || !cloudInstallDate.equals(installDate),
  };
};

export const shouldShowRateApp = (
  installDate: Temporal.Instant,
  now: Temporal.ZonedDateTime,
  appReviewed: boolean,
) => {
  if (appReviewed) {
    return false;
  }
  const installedAt = installDate.toZonedDateTimeISO(now.getTimeZone());
  const months = installedAt.until(now).total({
    unit: "months",
    relativeTo: installedAt,
  });
  return months >= RATE_APP_MIN_MONTHS;
};
