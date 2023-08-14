const BIRTHDAY_KEY = "birthday";

export const getValue = async () => {
  const birthdayString = localStorage.getItem(BIRTHDAY_KEY);
  if (birthdayString === null) {
    return null;
  }
  return birthdayString;
};

export const setValue = async (birthday: string | null) => {
  if (birthday === null) {
    localStorage.removeItem(BIRTHDAY_KEY);
  } else {
    localStorage.setItem(BIRTHDAY_KEY, birthday);
  }
};
