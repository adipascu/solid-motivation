const SUPPORTED_LANGUAGES = ["en", "ru"] as const;
const DEFAULT_LANGUAGE = "en";

const PREFERRED_LANGUAGES = window.navigator.languages.map((lang) =>
  lang.slice(0, 2),
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
const path = `./${MATCHED_LANGUAGE}` as const;
let data;
switch (path) {
  // TODO: remove workaround for TypeScript limitation
  case "./en":
    data = await import("./en");
    break;
  case "./ru":
    data = await import("./ru");
    break;
  default:
    throw new Error("Language not supported");
}

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
