import { describe, expect, it, vi } from "vitest";
import { Temporal } from "temporal-polyfill";
import { stubChrome } from "../test-helpers/chrome";

const BIRTHDAY_KEY = "birthday";
const INSTALL_DATE_KEY = "install_date";
const APP_REVIEWED_KEY = "app_reviewed";

const BIRTH_DAY = "1990-05-04";
const LONG_AGO = "2020-01-01T00:00:00Z";
const EVEN_LONGER_AGO = "2018-01-01T00:00:00Z";

type ChromeStub = ReturnType<typeof stubChrome>;

const monthsAgo = (months: number) =>
  Temporal.Now.instant().subtract({ hours: 24 * 31 * months });

const awaitCloudStorage = (chrome: ChromeStub) =>
  vi.waitFor(() => {
    expect(chrome.storage.sync.get).toHaveBeenCalledWith(
      [BIRTHDAY_KEY],
      expect.any(Function),
    );
  });

const loadStorage = async (chrome?: ChromeStub) => {
  vi.resetModules();
  const storage = await import("./index");
  if (chrome) {
    await awaitCloudStorage(chrome);
  }
  return storage;
};

describe("without the extension storage APIs", () => {
  it("starts without a birthday when none was ever entered", async () => {
    const { getBirthDay } = await loadStorage();
    expect(getBirthDay()).toBeNull();
  });

  it("restores the birthday kept in local storage", async () => {
    localStorage.setItem(BIRTHDAY_KEY, BIRTH_DAY);
    const { getBirthDay } = await loadStorage();
    expect(getBirthDay()?.toJSON()).toBe(BIRTH_DAY);
  });

  it("writes an entered birthday to local storage", async () => {
    const { setBirthDay } = await loadStorage();
    setBirthDay(Temporal.PlainDate.from(BIRTH_DAY));
    expect(localStorage.getItem(BIRTHDAY_KEY)).toBe(BIRTH_DAY);
  });

  it("forgets the birthday in local storage when it is reset", async () => {
    localStorage.setItem(BIRTHDAY_KEY, BIRTH_DAY);
    const { setBirthDay } = await loadStorage();
    setBirthDay(null);
    expect(localStorage.getItem(BIRTHDAY_KEY)).toBeNull();
  });

  it("records the install date on the first run", async () => {
    await loadStorage();
    const recorded = Temporal.Instant.from(
      localStorage.getItem(INSTALL_DATE_KEY) ?? "",
    );
    expect(
      Math.abs(recorded.since(Temporal.Now.instant()).total("seconds")),
    ).toBeLessThan(60);
  });

  it("keeps the recorded install date across restarts", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, LONG_AGO);
    await loadStorage();
    expect(localStorage.getItem(INSTALL_DATE_KEY)).toBe(LONG_AGO);
  });

  it("holds the rate prompt back on a fresh install", async () => {
    const { showRateApp } = await loadStorage();
    expect(showRateApp()).toBe(false);
  });

  it("offers the rate prompt once the extension is a few months old", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, monthsAgo(4).toString());
    const { showRateApp } = await loadStorage();
    expect(showRateApp()).toBe(true);
  });

  it("stops offering the rate prompt once it has been acted on", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, monthsAgo(4).toString());
    const { setAppReviewed, showRateApp } = await loadStorage();
    setAppReviewed();
    expect(showRateApp()).toBe(false);
    expect(localStorage.getItem(APP_REVIEWED_KEY)).toBe("true");
  });

  it("remembers a review left in an earlier session", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, monthsAgo(4).toString());
    localStorage.setItem(APP_REVIEWED_KEY, "true");
    const { showRateApp } = await loadStorage();
    expect(showRateApp()).toBe(false);
  });
});

describe("with the extension storage APIs", () => {
  it("syncs an entered birthday to the account", async () => {
    const chrome = stubChrome();
    const { setBirthDay } = await loadStorage(chrome);
    setBirthDay(Temporal.PlainDate.from(BIRTH_DAY));
    await vi.waitFor(() => {
      expect(chrome.sync[BIRTHDAY_KEY]).toBe(BIRTH_DAY);
    });
  });

  it("removes the birthday from the account when it is reset", async () => {
    localStorage.setItem(BIRTHDAY_KEY, BIRTH_DAY);
    const chrome = stubChrome({ [BIRTHDAY_KEY]: BIRTH_DAY });
    const { setBirthDay } = await loadStorage(chrome);
    setBirthDay(null);
    await vi.waitFor(() => {
      expect(chrome.storage.sync.remove).toHaveBeenCalledOnce();
    });
    expect(chrome.sync[BIRTHDAY_KEY]).toBeUndefined();
  });

  it("adopts a birthday already synced to the account", async () => {
    const chrome = stubChrome({ [BIRTHDAY_KEY]: BIRTH_DAY });
    const { getBirthDay } = await loadStorage(chrome);
    expect(getBirthDay()?.toJSON()).toBe(BIRTH_DAY);
    expect(localStorage.getItem(BIRTHDAY_KEY)).toBe(BIRTH_DAY);
  });

  it("writes nothing back when neither side has a birthday", async () => {
    const chrome = stubChrome();
    const { getBirthDay } = await loadStorage(chrome);
    expect(getBirthDay()).toBeNull();
    expect(chrome.storage.sync.remove).not.toHaveBeenCalled();
  });

  it("does not echo the birthday back when both sides already agree", async () => {
    localStorage.setItem(BIRTHDAY_KEY, BIRTH_DAY);
    localStorage.setItem(INSTALL_DATE_KEY, LONG_AGO);
    const chrome = stubChrome({
      [BIRTHDAY_KEY]: BIRTH_DAY,
      [INSTALL_DATE_KEY]: LONG_AGO,
    });
    const { getBirthDay } = await loadStorage(chrome);
    expect(getBirthDay()?.toJSON()).toBe(BIRTH_DAY);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
    expect(chrome.storage.sync.remove).not.toHaveBeenCalled();
  });

  it("adopts the account install date when it predates this device", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, LONG_AGO);
    const chrome = stubChrome({ [INSTALL_DATE_KEY]: EVEN_LONGER_AGO });
    const { showRateApp } = await loadStorage(chrome);
    expect(localStorage.getItem(INSTALL_DATE_KEY)).toBe(EVEN_LONGER_AGO);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
    expect(showRateApp()).toBe(true);
  });

  it("pushes the install date up to an account that has none", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, LONG_AGO);
    const chrome = stubChrome();
    await loadStorage(chrome);
    expect(chrome.sync[INSTALL_DATE_KEY]).toBe(LONG_AGO);
    expect(localStorage.getItem(INSTALL_DATE_KEY)).toBe(LONG_AGO);
  });

  it("leaves both install dates alone when they already agree", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, LONG_AGO);
    const chrome = stubChrome({ [INSTALL_DATE_KEY]: LONG_AGO });
    await loadStorage(chrome);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  });

  it("adopts a review left on another device", async () => {
    localStorage.setItem(INSTALL_DATE_KEY, LONG_AGO);
    const chrome = stubChrome({ [APP_REVIEWED_KEY]: true });
    const { showRateApp } = await loadStorage(chrome);
    expect(showRateApp()).toBe(false);
    expect(localStorage.getItem(APP_REVIEWED_KEY)).toBe("true");
  });

  it("pushes a review left on this device up to the account", async () => {
    localStorage.setItem(APP_REVIEWED_KEY, "true");
    const chrome = stubChrome({ [INSTALL_DATE_KEY]: LONG_AGO });
    await loadStorage(chrome);
    expect(chrome.sync[APP_REVIEWED_KEY]).toBe(true);
  });

  it("leaves the review flag alone when neither side has one", async () => {
    const chrome = stubChrome({ [INSTALL_DATE_KEY]: LONG_AGO });
    await loadStorage(chrome);
    expect(chrome.sync[APP_REVIEWED_KEY]).toBeUndefined();
  });

  it("syncs a review made on this device to the account", async () => {
    const chrome = stubChrome({ [INSTALL_DATE_KEY]: LONG_AGO });
    const { setAppReviewed } = await loadStorage(chrome);
    setAppReviewed();
    expect(chrome.sync[APP_REVIEWED_KEY]).toBe(true);
  });
});
