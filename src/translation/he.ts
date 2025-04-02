import type { Temporal } from "temporal-polyfill";

export const AGE = "גיל";
export const SOURCE_CODE = "קוד מקור";
export const COPY_LABEL = "יש ללחוץ בשביל להעתיק את הגיל ללוח הגזירים";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `יום ההולדת: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "הגיל הועתק ללוח הגזירים.";
export const AGE_COPY_FAILED = "נכשלה העתקת הגיל ללוח הגזירים.";
export const ENTER_BIRTHDAY = "נא למלא את יום ההולדת שלך";
export const MOTIVATE = "יאללה מוטיבציה";
