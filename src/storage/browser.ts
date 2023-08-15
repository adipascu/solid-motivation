const BIRTHDAY_KEY = "birthday";

export const getLocalValue = () => localStorage.getItem(BIRTHDAY_KEY);

export const setLocalValue = (birthday: string | null) => {
  if (birthday === null) {
    localStorage.removeItem(BIRTHDAY_KEY);
  } else {
    localStorage.setItem(BIRTHDAY_KEY, birthday);
  }
};
