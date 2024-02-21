import type { Temporal } from "temporal-polyfill";

export const AGE = "Idade";
export const SOURCE_CODE = "código fonte";
export const COPY_LABEL =
  "Clique para copiar a idade para a área de transferência";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Aniversário: ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Idade copiada para a área de transferência!";
export const AGE_COPY_FAILED =
  "Falha ao copiar idade para a área de transferência!";
export const ENTER_BIRTHDAY = "Digite sua data de nascimento";
export const MOTIVATE = "Motivar";
