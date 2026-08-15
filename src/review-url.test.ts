import { describe, expect, it } from "vitest";
import { getReviewUrl, reviewUrlForBrowser } from "./review-url";

const CHROME_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const FIREFOX_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0";
const SAFARI_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";

const withUserAgent = (userAgent: string) => {
  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    value: userAgent,
  });
  return getReviewUrl();
};

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/ebnfiihobaicohplfgeenddclnjblfkc";
const FIREFOX_STORE_URL =
  "https://addons.mozilla.org/en-US/firefox/addon/solid-motivation/";

describe("reviewUrlForBrowser", () => {
  it("sends Chrome to the Chrome Web Store", () => {
    expect(reviewUrlForBrowser("Chrome")).toBe(CHROME_STORE_URL);
  });

  it("sends other Chromium browsers to the Chrome Web Store", () => {
    expect(reviewUrlForBrowser("Chromium")).toBe(CHROME_STORE_URL);
    expect(reviewUrlForBrowser("Microsoft Edge")).toBe(CHROME_STORE_URL);
    expect(reviewUrlForBrowser("Opera")).toBe(CHROME_STORE_URL);
    expect(reviewUrlForBrowser("Vivaldi")).toBe(CHROME_STORE_URL);
  });

  it("sends Firefox to the add-ons site", () => {
    expect(reviewUrlForBrowser("Firefox")).toBe(FIREFOX_STORE_URL);
  });

  it("returns null for browsers the extension is not published on", () => {
    expect(reviewUrlForBrowser("Safari")).toBeNull();
    expect(reviewUrlForBrowser("Internet Explorer")).toBeNull();
  });

  it("returns null when the browser cannot be identified", () => {
    expect(reviewUrlForBrowser(undefined)).toBeNull();
    expect(reviewUrlForBrowser("")).toBeNull();
  });
});

describe("getReviewUrl", () => {
  it("reads the browser off the user agent", () => {
    expect(withUserAgent(CHROME_USER_AGENT)).toBe(CHROME_STORE_URL);
    expect(withUserAgent(FIREFOX_USER_AGENT)).toBe(FIREFOX_STORE_URL);
    expect(withUserAgent(SAFARI_USER_AGENT)).toBeNull();
  });
});
