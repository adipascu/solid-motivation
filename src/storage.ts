import { Temporal } from '@js-temporal/polyfill';

const BIRTHDAY_KEY = 'birthday';

const parseNumber = (value: string) => {
  var number = Number(value);
  if (isNaN(number)) {
    throw new Error(`'${value}' is not a valid number.`);
  }
  return number;
}

export const getBirthDay = () => {
  const birthdayString = localStorage.getItem(BIRTHDAY_KEY);
  if (birthdayString === null) {
    return null;
  }

  return Temporal.PlainDate.from(birthdayString);
}

export const setBirthDay = (birthday: Temporal.PlainDate) => {
  localStorage.setItem(BIRTHDAY_KEY, birthday.toJSON());
}