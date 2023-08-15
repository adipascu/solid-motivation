import { Temporal } from "temporal-polyfill";
import { Getter, Setter } from "./types";

const { getValue, setValue } = (await (window?.chrome?.storage
  ? import("./extension")
  : import("./browser"))) satisfies {
  getValue: Getter;
  setValue: Setter;
};

export type BirthDay = Temporal.PlainDate | null;

export const getBirthDay = async (): Promise<BirthDay> => {
  const birthdayString = await new Promise<string | null>((resolve) => {
    getValue(resolve);
  });
  if (birthdayString === null) {
    return null;
  }
  return Temporal.PlainDate.from(birthdayString);
};

export const setBirthDay = async (birthday: BirthDay) => {
  if (birthday === null) {
    await setValue(null);
  } else {
    await setValue(birthday.toJSON());
  }
};
