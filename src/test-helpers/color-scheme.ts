type PreferenceListener = (event: { matches: boolean }) => void;

const listeners: PreferenceListener[] = [];
let prefersDark = false;

export const stubColorSchemeQuery = () => {
  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    writable: true,
    value: (media: string) => ({
      media,
      get matches() {
        return prefersDark;
      },
      addEventListener: (type: string, listener: PreferenceListener) => {
        if (type === "change") {
          listeners.push(listener);
        }
      },
      removeEventListener: (type: string, listener: PreferenceListener) => {
        const registered = listeners.indexOf(listener);
        if (type === "change" && registered !== -1) {
          listeners.splice(registered, 1);
        }
      },
    }),
  });
};

export const preferDarkMode = (matches: boolean) => {
  prefersDark = matches;
  listeners.forEach((listener) => {
    listener({ matches });
  });
};
