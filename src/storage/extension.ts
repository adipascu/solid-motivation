const BIRTHDAY_KEY = "birthday";

const { chrome } = window;

export const getValue = (obs: (value: string | null) => void) => {
  chrome.storage.sync.get([BIRTHDAY_KEY], (result) => {
    const newValue = result[BIRTHDAY_KEY];
    if (typeof newValue === "string") {
      obs(newValue);
    } else {
      obs(null);
    }
  });
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

export const setValue = (birthday: string | null) =>
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
