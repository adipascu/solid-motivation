import { Effect } from "effect";

const BIRTHDAY_KEY = "birthday";

const { chrome } = window;

const asBirthDay = (value: unknown) =>
  typeof value === "string" ? value : null;

export const getValue = (obs: (value: string | null) => void) => {
  chrome.storage.sync.get([BIRTHDAY_KEY], (result) => {
    obs(asBirthDay(result[BIRTHDAY_KEY]));
  });
  const cb = (
    changes: { [key: string]: { newValue?: unknown } },
    areaName: string,
  ) => {
    if (areaName === "sync" && changes[BIRTHDAY_KEY]) {
      obs(asBirthDay(changes[BIRTHDAY_KEY].newValue));
    }
  };
  chrome.storage.onChanged.addListener(cb);
  return () => {
    chrome.storage.onChanged.removeListener(cb);
  };
};

export const setValue = (birthday: string | null) =>
  Effect.async<void, Error>((resume) => {
    const settle = () => {
      const failure = chrome.runtime.lastError;
      resume(
        failure
          ? Effect.fail(
              new Error(failure.message ?? "chrome.storage.sync refused"),
            )
          : Effect.void,
      );
    };
    if (birthday === null) {
      chrome.storage.sync.remove(BIRTHDAY_KEY, settle);
    } else {
      chrome.storage.sync.set({ [BIRTHDAY_KEY]: birthday }, settle);
    }
  });
