import type { Temporal } from "temporal-polyfill";

export const AGE = "Edad";
export const SOURCE_CODE = "código fuente";
export const COPY_LABEL = "Haz clic para copiar la edad al portapapeles";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Fecha de nacimiento: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "¡Edad copiada al portapapeles!";
export const AGE_COPY_FAILED = "No se pudo copiar la edad al portapapeles.";
export const ENTER_BIRTHDAY = "Introduce tu fecha de nacimiento";
export const MOTIVATE = "Motivar";
