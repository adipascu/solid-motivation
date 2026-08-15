const RIGHT_TO_LEFT_LANGUAGES = ["ar", "fa", "he", "ur"];

const textDirection = (language: string) =>
  RIGHT_TO_LEFT_LANGUAGES.includes(language.split("-")[0]) ? "rtl" : "ltr";

export default textDirection;
