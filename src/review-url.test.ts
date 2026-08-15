import { reviewUrlForBrowser } from "./review-url";

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
