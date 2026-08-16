import textDirection from "../text-direction";

const TRANSLATIONS = {
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

type Language = keyof typeof TRANSLATIONS;

const DEFAULT_LANGUAGE = "en";

const isSupported = (language: string): language is Language =>
  Object.hasOwn(TRANSLATIONS, language);

const PREFERRED_LANGUAGES = window.navigator.languages.map(
  (language) => language.split("-")[0],
);

const MATCHED_LANGUAGE =
  PREFERRED_LANGUAGES.find(isSupported) ?? DEFAULT_LANGUAGE;

const data = await TRANSLATIONS[MATCHED_LANGUAGE]();

export const {
  AGE,
  SOURCE_CODE,
  COPY_LABEL,
  BIRTH_DAY_FORMAT,
  AGE_COPIED,
  AGE_COPY_FAILED,
  ENTER_BIRTHDAY,
  MOTIVATE,
  RATE_APP,
  SETTINGS_LABEL,
} = data;

export const LANGUAGE = MATCHED_LANGUAGE;
export const TEXT_DIRECTION = textDirection(MATCHED_LANGUAGE);
