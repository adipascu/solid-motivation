import { describe, expect, it, vi } from "vitest";

type PreferenceListener = (event: { matches: boolean }) => void;

const loadDarkSignal = async (matchesInitially: boolean) => {
  const listeners: PreferenceListener[] = [];
  const matchMedia = vi.fn(() => ({
    matches: matchesInitially,
    addEventListener: (type: string, listener: PreferenceListener) => {
      if (type === "change") {
        listeners.push(listener);
      }
    },
  }));
  vi.stubGlobal("matchMedia", matchMedia);
  vi.resetModules();
  const { default: getDarkMode } = await import("./dark-signal");
  return {
    getDarkMode,
    matchMedia,
    changePreference: (matches: boolean) => {
      listeners.forEach((listener) => listener({ matches }));
    },
  };
};

describe("dark mode", () => {
  it("asks the browser for the dark colour scheme preference", async () => {
    const { matchMedia } = await loadDarkSignal(false);
    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
  });

  it("starts light when the browser is not in dark mode", async () => {
    const { getDarkMode } = await loadDarkSignal(false);
    expect(getDarkMode()).toBe(false);
  });

  it("starts dark when the browser already is in dark mode", async () => {
    const { getDarkMode } = await loadDarkSignal(true);
    expect(getDarkMode()).toBe(true);
  });

  it("follows the preference when it changes while the page is open", async () => {
    const { getDarkMode, changePreference } = await loadDarkSignal(false);
    changePreference(true);
    expect(getDarkMode()).toBe(true);
    changePreference(false);
    expect(getDarkMode()).toBe(false);
  });
});
