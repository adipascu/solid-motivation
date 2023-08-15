import { Getter, Setter } from "./types";

const BIRTHDAY_KEY = "birthday";

const { chrome } = window;

export const getValue: Getter = (obs) => {
  const cb = (
    changes: { [key: string]: { newValue?: any } },
    areaName: string,
  ) => {
    if (areaName === "sync" && changes[BIRTHDAY_KEY]) {
      const { newValue } = changes[BIRTHDAY_KEY];
      if (typeof newValue === "string") {
        obs(newValue);
      } else {
        obs(null);
      }
    }
  };
  chrome.storage.onChanged.addListener(cb);
  return () => {
    chrome.storage.onChanged.removeListener(cb);
  };
};

export const setValue: Setter = (birthday: string | null) =>
  new Promise<void>((resolve, reject) => {
    if (birthday === null) {
      chrome.storage.sync.remove(BIRTHDAY_KEY, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      chrome.storage.sync.set({ [BIRTHDAY_KEY]: birthday }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    }
  });
