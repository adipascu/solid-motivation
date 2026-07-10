import Bowser from "bowser";
import assertUnreachable from "../assertUnreachable";

const SUPPORTED_LANGUAGES = [
  "en", // English
  "ru", // Russian
  "uk", // Ukrainian
  "cs", // Czech
  "de", // German
  "pt", // Portuguese
  "fr", // French
  "zh", // Chinese
  "pl", // Polish
  "es", // Spanish
  "sv", // Swedish
  "he", // Hebrew
] as const;
const DEFAULT_LANGUAGE = "en";

const PREFERRED_LANGUAGES = window.navigator.languages.map(
  (lang) => lang.split("-")[0],
);

const getMatchedLanguage = () => {
  for (const lang of PREFERRED_LANGUAGES) {
    const match = SUPPORTED_LANGUAGES.find((supportedLang) => {
      return lang === supportedLang;
    });
    if (match) {
      return match;
    }
  }
  return DEFAULT_LANGUAGE;
};

const MATCHED_LANGUAGE = getMatchedLanguage();

const loaders: Record<typeof SUPPORTED_LANGUAGES[number], () => Promise<any>> = {
  en: () => import("./en"),
  ru: () => import("./ru"),
  uk: () => import("./uk"),
  cs: () => import("./cs"),
  de: () => import("./de"),
  pt: () => import("./pt"),
  fr: () => import("./fr"),
  zh: () => import("./zh"),
  pl: () => import("./pl"),
  es: () => import("./es"),
  sv: () => import("./sv"),
  he: () => import("./he"),
};

const data = await loaders[MATCHED_LANGUAGE]();

export const {
  AGE,
  SOURCE_CODE,
  COPY_LABEL,
  BIRTH_DAY_FORMAT,
  AGE_COPIED,
  AGE_COPY_FAILED,
  ENTER_BIRTHDAY,
  MOTIVATE,
} = data;

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/ebnfiihobaicohplfgeenddclnjblfkc";
const FIREFOX_STORE_URL =
  "https://addons.mozilla.org/en-US/firefox/addon/solid-motivation/";

export const REVIEW_URL = (() => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  const browserName = browser.getBrowserName();

  switch (browserName) {
    case "Chrome":
      return CHROME_STORE_URL;
    case "Firefox":
      return FIREFOX_STORE_URL;
    default:
      return null;
  }
})();
