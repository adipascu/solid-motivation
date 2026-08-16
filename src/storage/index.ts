import { Temporal } from "temporal-polyfill";
import { createEffect, createRoot, createSignal } from "solid-js";
import { Effect } from "effect";
import { getStoredValue, removeStoredValue, setStoredValue } from "./local";
import { resolveInstallDate, shouldShowRateApp } from "../rate-app";
import { parseInstant, parsePlainDate } from "../parse-temporal";

const BIRTHDAY_KEY = "birthday";
const INSTALL_DATE_KEY = "install_date";
const APP_REVIEWED_KEY = "app_reviewed";

const cloudStorage = window.chrome?.storage
  ? Effect.promise(() => import("./extension"))
  : null;

type BirthDay = Temporal.PlainDate | null;

const mapFromBirthDay = (birthday: BirthDay): string | null => {
  if (birthday === null) {
    return null;
  }
  return birthday.toJSON();
};

const storeBirthDay = (birthdayString: string | null) => {
  if (birthdayString === null) {
    removeStoredValue(BIRTHDAY_KEY);
  } else {
    setStoredValue(BIRTHDAY_KEY, birthdayString);
  }
};

export const [getBirthDay, setBirthDay] = createSignal<BirthDay>(
  parsePlainDate(getStoredValue(BIRTHDAY_KEY)),
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
    storeBirthDay(birthdayString);
    if (cloudStorage) {
      Effect.runFork(
        cloudStorage.pipe(
          Effect.flatMap(({ setValue }) => setValue(birthdayString)),
          Effect.catchAllCause(Effect.logError),
        ),
      );
    }
  });
});

if (cloudStorage) {
  Effect.runFork(
    cloudStorage.pipe(
      Effect.map(({ getValue }) =>
        getValue((birthdayString) => {
          const currentBirthDayString = mapFromBirthDay(getBirthDay());
          if (birthdayString !== currentBirthDayString) {
            setBirthDay(parsePlainDate(birthdayString));
          }
        }),
      ),
      Effect.catchAllCause(Effect.logError),
    ),
  );
}

const storedInstallDate = parseInstant(getStoredValue(INSTALL_DATE_KEY));

const [getInstallDate, setInstallDate] = createSignal(
  storedInstallDate ?? Temporal.Now.instant(),
);

if (storedInstallDate === null) {
  setStoredValue(INSTALL_DATE_KEY, getInstallDate().toString());
}

window.chrome?.storage?.sync?.get([INSTALL_DATE_KEY], (result) => {
  const { installDate, updateLocal, updateCloud } = resolveInstallDate(
    getInstallDate(),
    parseInstant(result[INSTALL_DATE_KEY]),
    Temporal.Now.instant(),
  );
  if (updateLocal) {
    setInstallDate(installDate);
    setStoredValue(INSTALL_DATE_KEY, installDate.toString());
  }
  if (updateCloud) {
    void window.chrome?.storage?.sync?.set({
      [INSTALL_DATE_KEY]: installDate.toString(),
    });
  }
});

const [getAppReviewed, setAppReviewedSignal] = createSignal(
  getStoredValue(APP_REVIEWED_KEY) === "true",
);

window.chrome?.storage?.sync?.get([APP_REVIEWED_KEY], (result) => {
  if (result[APP_REVIEWED_KEY] === true) {
    setAppReviewedSignal(true);
    setStoredValue(APP_REVIEWED_KEY, "true");
  } else if (getAppReviewed()) {
    void window.chrome?.storage?.sync?.set({ [APP_REVIEWED_KEY]: true });
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
  setStoredValue(APP_REVIEWED_KEY, "true");
  void window.chrome?.storage?.sync?.set({ [APP_REVIEWED_KEY]: true });
};
