import { Temporal } from "temporal-polyfill";

const { getValue, setValue } = await (window?.chrome?.storage
  ? import("./extension")
  : import("./browser"));

export type BirthDay = Temporal.PlainDate | null;

export const getBirthDay = async (): Promise<BirthDay> => {
  const birthdayString = await getValue();
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
