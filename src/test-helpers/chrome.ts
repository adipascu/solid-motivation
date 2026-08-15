import { vi } from "vitest";

type SyncItems = Record<string, unknown>;
type SyncGetCallback = (items: SyncItems) => void;
type StorageChanges = Record<string, { newValue?: unknown }>;
type StorageChangeListener = (
  changes: StorageChanges,
  areaName: string,
) => void;

export const stubChrome = (initialSync: SyncItems = {}) => {
  const sync: SyncItems = { ...initialSync };
  const changeListeners: StorageChangeListener[] = [];
  let lastError: { message?: string } | undefined;

  const storage = {
    sync: {
      get: vi.fn((keys: string[], callback: SyncGetCallback) => {
        callback(
          Object.fromEntries(
            keys.filter((key) => key in sync).map((key) => [key, sync[key]]),
          ),
        );
      }),
      set: vi.fn((items: SyncItems, callback?: () => void) => {
        Object.assign(sync, items);
        callback?.();
      }),
      remove: vi.fn((key: string, callback?: () => void) => {
        delete sync[key];
        callback?.();
      }),
    },
    onChanged: {
      addListener: vi.fn((listener: StorageChangeListener) => {
        changeListeners.push(listener);
      }),
      removeListener: vi.fn((listener: StorageChangeListener) => {
        const registered = changeListeners.indexOf(listener);
        if (registered !== -1) {
          changeListeners.splice(registered, 1);
        }
      }),
    },
  };

  vi.stubGlobal("chrome", {
    storage,
    runtime: {
      get lastError() {
        return lastError;
      },
    },
  });

  return {
    storage,
    sync,
    changeListeners,
    failWrites: (message?: string) => {
      lastError = { message };
    },
    emitChange: (changes: StorageChanges, areaName: string) => {
      changeListeners.forEach((listener) => listener(changes, areaName));
    },
  };
};
