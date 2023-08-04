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

  var dateParts = birthdayString.split('-');
  const birthday = new Date();
  birthday.setFullYear(parseNumber(dateParts[0]));
  birthday.setMonth(parseNumber(dateParts[1]) - 1);
  birthday.setDate(parseNumber(dateParts[2]));
  birthday.setHours(0, 0, 0, 0);
  return birthday;
}

export const setBirthDay = (birthday: Date) => {
  localStorage.setItem(BIRTHDAY_KEY, birthday.toISOString().split('T')[0]);
}