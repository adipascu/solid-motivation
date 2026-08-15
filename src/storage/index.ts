import { Temporal } from "temporal-polyfill";
import { createEffect, createRoot, createSignal } from "solid-js";
import { getLocalValue, setLocalValue } from "./browser";
import {
  parseInstant,
  resolveInstallDate,
  shouldShowRateApp,
} from "../rate-app";

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
  mapToBirthDay(getLocalValue()),
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

const INSTALL_DATE_KEY = "install_date";
const APP_REVIEWED_KEY = "app_reviewed";

const storedInstallDate = parseInstant(localStorage.getItem(INSTALL_DATE_KEY));

const [getInstallDate, setInstallDate] = createSignal(
  storedInstallDate ?? Temporal.Now.instant(),
);

if (storedInstallDate === null) {
  localStorage.setItem(INSTALL_DATE_KEY, getInstallDate().toString());
}

window?.chrome?.storage?.sync?.get([INSTALL_DATE_KEY], (result) => {
  const { installDate, updateLocal, updateCloud } = resolveInstallDate(
    getInstallDate(),
    parseInstant(result[INSTALL_DATE_KEY]),
    Temporal.Now.instant(),
  );
  if (updateLocal) {
    setInstallDate(installDate);
    localStorage.setItem(INSTALL_DATE_KEY, installDate.toString());
  }
  if (updateCloud) {
    window?.chrome?.storage?.sync?.set({
      [INSTALL_DATE_KEY]: installDate.toString(),
    });
  }
});

const [getAppReviewed, setAppReviewedSignal] = createSignal(
  localStorage.getItem(APP_REVIEWED_KEY) === "true",
);

window?.chrome?.storage?.sync?.get([APP_REVIEWED_KEY], (result) => {
  if (result[APP_REVIEWED_KEY] === true) {
    setAppReviewedSignal(true);
    localStorage.setItem(APP_REVIEWED_KEY, "true");
  } else if (getAppReviewed()) {
    window?.chrome?.storage?.sync?.set({ [APP_REVIEWED_KEY]: true });
  }
});

export const showRateApp = () =>
  shouldShowRateApp(
    getInstallDate(),
    Temporal.Now.zonedDateTimeISO(),
    getAppReviewed(),
  );

export const setAppReviewed = () => {
  setAppReviewedSignal(true);
  localStorage.setItem(APP_REVIEWED_KEY, "true");
  window?.chrome?.storage?.sync?.set({ [APP_REVIEWED_KEY]: true });
};
