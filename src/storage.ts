import { Temporal } from 'temporal-polyfill';

const BIRTHDAY_KEY = 'birthday';

export const getBirthDay = () => {
  const birthdayString = localStorage.getItem(BIRTHDAY_KEY);
  if (birthdayString === null) {
    return null;
  }

  return Temporal.PlainDate.from(birthdayString);
}

export const setBirthDay = (birthday: Temporal.PlainDate | null) => {
  if (birthday === null) {
    localStorage.removeItem(BIRTHDAY_KEY)
  } else {
    localStorage.setItem(BIRTHDAY_KEY, birthday.toJSON());
  }
}