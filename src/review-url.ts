import Bowser from "bowser";

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/ebnfiihobaicohplfgeenddclnjblfkc";
const FIREFOX_STORE_URL =
  "https://addons.mozilla.org/en-US/firefox/addon/solid-motivation/";

export const reviewUrlForBrowser = (browserName: string | undefined) => {
  switch (browserName) {
    case "Chrome":
    case "Chromium":
    case "Microsoft Edge":
    case "Opera":
    case "Vivaldi":
      return CHROME_STORE_URL;
    case "Firefox":
      return FIREFOX_STORE_URL;
    default:
      return null;
  }
};

export const getReviewUrl = () =>
  reviewUrlForBrowser(
    Bowser.getParser(window.navigator.userAgent).getBrowserName(),
  );
