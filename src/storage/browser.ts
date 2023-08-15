import type { Getter, Setter } from "./types";

const BIRTHDAY_KEY = "birthday";

export const getValue: Getter = (obs) => {
  obs(localStorage.getItem(BIRTHDAY_KEY));
  return () => {};
};

export const setValue: Setter = async (birthday: string | null) => {
  if (birthday === null) {
    localStorage.removeItem(BIRTHDAY_KEY);
  } else {
    localStorage.setItem(BIRTHDAY_KEY, birthday);
  }
};
