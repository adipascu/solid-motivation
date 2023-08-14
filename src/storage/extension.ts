const BIRTHDAY_KEY = "birthday";

const { chrome } = window;

export const getValue = () =>
  new Promise<string | null>((resolve, reject) => {
    chrome.storage.sync.get([BIRTHDAY_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[BIRTHDAY_KEY] || null);
      }
    });
  });

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
