import { Temporal } from "temporal-polyfill";
import { createEffect, createRoot, createSignal } from "solid-js";
import { getLocalValue, setLocalValue } from "./browser";

const cloudStorage = window?.chrome?.storage ? import("./extension") : null;

type BirthDay = Temporal.PlainDate | null;

const mapToBirthDay = (birthdayString: string | null): BirthDay => {
  if (birthdayString === null) {
    return null;
  }
  return Temporal.PlainDate.from(birthdayString);
};

const mapFromBirthDay = (birthday: BirthDay): string | null => {
  if (birthday === null) {
    return null;
  }
  return birthday.toJSON();
};

// eslint-disable-next-line import/no-unused-modules -- workaround for https://github.com/import-js/eslint-plugin-import/pull/2038
export const [getBirthDay, setBirthDay] = createSignal<BirthDay>(
  mapToBirthDay(getLocalValue())
);

createRoot(() => {
  let initialRender = true;
  createEffect(() => {
    const value = getBirthDay();
    if (initialRender) {
      initialRender = false;
      return;
    }
    const birthdayString = mapFromBirthDay(value);
    setLocalValue(birthdayString);
    if (cloudStorage) {
      cloudStorage.then(({ setValue }) => {
        setValue(birthdayString);
      });
    }
  });
});

if (cloudStorage) {
  cloudStorage.then(({ getValue }) => {
    getValue((birthdayString) => {
      const currentBirthDayString = mapFromBirthDay(getBirthDay());
      if (birthdayString !== currentBirthDayString) {
        setBirthDay(mapToBirthDay(birthdayString));
      }
    });
  });
}

export let INSTALL_DATE = (() => {
  const date = localStorage.getItem("install_date");
  if (date) {
    return Temporal.Instant.from(date);
  } else {
    const newDate = Temporal.Now.instant();
    window?.chrome?.storage?.sync?.set({
      install_date: newDate.toString(),
    });
    localStorage.setItem("install_date", newDate.toString());
    return newDate;
  }
})();

window?.chrome?.storage?.sync?.get(["install_date"], (result) => {
  const date = result["install_date"];
  if (date) {
    INSTALL_DATE = Temporal.Instant.from(date);
  }
});
