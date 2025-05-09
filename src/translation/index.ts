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
const path = `./${MATCHED_LANGUAGE}` as const;
let data;
switch (path) {
  // TODO: remove workaround for TypeScript limitation https://github.com/microsoft/TypeScript/issues/32401
  case "./en":
    data = await import("./en");
    break;
  case "./ru":
    data = await import("./ru");
    break;
  case "./uk":
    data = await import("./uk");
    break;
  case "./cs":
    data = await import("./cs");
    break;
  case "./de":
    data = await import("./de");
    break;
  case "./pt":
    data = await import("./pt");
    break;
  case "./fr":
    data = await import("./fr");
    break;
  case "./zh":
    data = await import("./zh");
    break;
  case "./pl":
    data = await import("./pl");
    break;
  case "./es":
    data = await import("./es");
    break;
  case "./sv":
    data = await import("./sv");
    break;
  case "./he":
    data = await import("./he");
    break;
  default:
    assertUnreachable(path);
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
