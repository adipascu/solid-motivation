import type { Temporal } from "temporal-polyfill";

export const AGE = "Âge";
export const SOURCE_CODE = "code source";
export const COPY_LABEL = "Cliquez pour copier l'âge dans le presse-papiers";
export const BIRTH_DAY_FORMAT = (birthDay: Temporal.PlainDate) =>
  `Anniversaire : ${birthDay.toLocaleString()}`;
export const AGE_COPIED = "Âge copié dans le presse-papiers !";
export const AGE_COPY_FAILED =
  "Échec de la copie de l'âge dans le presse-papiers !";
export const ENTER_BIRTHDAY = "Entrez votre date de naissance";
export const MOTIVATE = "Motiver";
