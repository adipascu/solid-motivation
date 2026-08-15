import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Temporal } from "temporal-polyfill";
import Countdown from "./Countdown";
import { calculateAgeLocal } from "./calculate-age";
import { GIT_HASH } from "./config";
import { preferDarkMode } from "./test-helpers/color-scheme";
import {
  AGE,
  AGE_COPIED,
  AGE_COPY_FAILED,
  BIRTH_DAY_FORMAT,
  COPY_LABEL,
  RATE_APP,
  SETTINGS_LABEL,
  SOURCE_CODE,
} from "./translation";

const BIRTH_DAY = Temporal.PlainDate.from("1990-05-04");
const STORE_URL = "https://store.example/solid-motivation";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
const storage = vi.hoisted(() => ({
  showRateApp: vi.fn(),
  setAppReviewed: vi.fn(),
}));
const review = vi.hoisted((): { url: string | null } => ({ url: null }));
const clipboard = vi.hoisted(() => ({ writeText: vi.fn() }));

vi.mock("solid-toast", () => ({
  default: { success: toast.success, error: toast.error },
  Toaster: () => null,
}));

vi.mock("./storage", () => ({
  showRateApp: storage.showRateApp,
  setAppReviewed: storage.setAppReviewed,
}));

vi.mock("./review-url", () => ({ getReviewUrl: () => review.url }));

const frames: FrameRequestCallback[] = [];
const cancelledFrames: number[] = [];

const runFrame = () => {
  frames[frames.length - 1](0);
};

const renderCountdown = () => {
  const openSettings = vi.fn();
  const result = render(() => (
    <Countdown birthDay={BIRTH_DAY} openSettings={openSettings} />
  ));
  const copyAge = screen.getByRole("button", { name: COPY_LABEL });
  const settings = screen.getByRole("button", { name: SETTINGS_LABEL });
  const sourceLink = screen.getByTitle(GIT_HASH);
  const hoverArea = copyAge.parentElement?.parentElement;
  if (!hoverArea) {
    throw new Error("Countdown rendered without its hover area");
  }
  return { ...result, openSettings, copyAge, settings, sourceLink, hoverArea };
};

beforeEach(() => {
  frames.length = 0;
  cancelledFrames.length = 0;
  review.url = null;
  toast.success.mockReset();
  toast.error.mockReset();
  storage.showRateApp.mockReset().mockReturnValue(false);
  storage.setAppReviewed.mockReset();
  clipboard.writeText.mockReset().mockResolvedValue(undefined);
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: { writeText: clipboard.writeText },
  });
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => frames.push(callback)),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((handle: number) => cancelledFrames.push(handle)),
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("the age readout", () => {
  it("splits the age into whole years and eleven decimals", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-06-01T00:00:00Z"));
    renderCountdown();
    const [whole, fraction] = screen.getAllByTitle(COPY_LABEL);
    const age = calculateAgeLocal(BIRTH_DAY);
    expect(whole.textContent).toBe(Math.floor(age).toString());
    expect(fraction.textContent).toBe(`.${age.toFixed(11).split(".")[1]}`);
  });

  it("names the birthday it counts from", () => {
    renderCountdown();
    expect(screen.getByTitle(BIRTH_DAY_FORMAT(BIRTH_DAY))).toBeDefined();
  });

  it("rounds the whole years down rather than to the nearest", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-12-01T00:00:00Z"));
    renderCountdown();
    const [whole] = screen.getAllByTitle(COPY_LABEL);
    expect(calculateAgeLocal(BIRTH_DAY) % 1).toBeGreaterThan(0.5);
    expect(whole.textContent).toBe("34");
  });

  it("recomputes the age on every animation frame", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-06-01T00:00:00Z"));
    renderCountdown();
    const [whole, fraction] = screen.getAllByTitle(COPY_LABEL);
    expect(whole.textContent).toBe("34");
    const firstFraction = fraction.textContent;
    vi.setSystemTime(new Date("2025-07-15T06:00:00Z"));
    runFrame();
    expect(whole.textContent).toBe("35");
    expect(fraction.textContent).not.toBe(firstFraction);
    expect(fraction.textContent).toBe(
      `.${calculateAgeLocal(BIRTH_DAY).toFixed(11).split(".")[1]}`,
    );
  });

  it("stops asking for animation frames once it is torn down", () => {
    const { unmount } = renderCountdown();
    runFrame();
    unmount();
    expect(cancelledFrames).toEqual([frames.length]);
  });
});

describe("copying the age", () => {
  it("puts the whole age on the clipboard and confirms it", async () => {
    renderCountdown();
    fireEvent.click(screen.getAllByTitle(COPY_LABEL)[0]);
    await vi.waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(AGE_COPIED);
    });
    expect(clipboard.writeText).toHaveBeenCalledWith(
      expect.stringMatching(/^\d+\.\d{11}$/),
    );
  });

  it("copies from the fractional part too", async () => {
    renderCountdown();
    fireEvent.click(screen.getAllByTitle(COPY_LABEL)[1]);
    await vi.waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(AGE_COPIED);
    });
  });

  it("copies from the labelled button too", async () => {
    const { copyAge } = renderCountdown();
    expect(copyAge.textContent).toBe(AGE);
    fireEvent.click(copyAge);
    await vi.waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(AGE_COPIED);
    });
  });

  it("reports a clipboard the browser refused", async () => {
    clipboard.writeText.mockRejectedValue(new Error("clipboard blocked"));
    renderCountdown();
    fireEvent.click(screen.getAllByTitle(COPY_LABEL)[0]);
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(AGE_COPY_FAILED);
    });
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("reports a browser that offers no clipboard at all", async () => {
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    renderCountdown();
    fireEvent.click(screen.getAllByTitle(COPY_LABEL)[0]);
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(AGE_COPY_FAILED);
    });
  });
});

describe("the hover affordances", () => {
  it("keeps the gear and the source link out of sight until hovered", () => {
    const { settings, sourceLink } = renderCountdown();
    expect(settings.style.opacity).toBe("0");
    expect(sourceLink.style.opacity).toBe("0");
  });

  it("reveals them while the pointer is over the age", () => {
    const { settings, sourceLink, hoverArea } = renderCountdown();
    fireEvent.mouseEnter(hoverArea);
    expect(settings.style.opacity).toBe("1");
    expect(sourceLink.style.opacity).toBe("1");
    fireEvent.mouseLeave(hoverArea);
    expect(settings.style.opacity).toBe("0");
  });

  it("reveals them for a keyboard visitor who tabs to the gear", () => {
    const { settings, sourceLink } = renderCountdown();
    fireEvent.focus(settings);
    expect(settings.style.opacity).toBe("1");
    expect(sourceLink.style.opacity).toBe("1");
    fireEvent.blur(settings);
    expect(settings.style.opacity).toBe("0");
  });

  it("reveals them for a keyboard visitor who tabs to the source link", () => {
    const { settings, sourceLink } = renderCountdown();
    fireEvent.focus(sourceLink);
    expect(settings.style.opacity).toBe("1");
    fireEvent.blur(sourceLink);
    expect(settings.style.opacity).toBe("0");
  });

  it("straightens the gear once it is on show", () => {
    const { hoverArea, settings } = renderCountdown();
    const gear = settings.querySelector("svg");
    expect(gear?.style.transform).toBe("rotate(-30deg)");
    fireEvent.mouseEnter(hoverArea);
    expect(gear?.style.transform).toBe("rotate(0deg)");
  });

  it("links to the source code", () => {
    const { sourceLink } = renderCountdown();
    expect(sourceLink.textContent).toBe(`(${SOURCE_CODE})`);
    expect(sourceLink.getAttribute("href")).toBe(
      "https://github.com/adipascu/solid-motivation",
    );
  });

  it("opens the settings when the gear is clicked", () => {
    const { settings, openSettings } = renderCountdown();
    fireEvent.click(settings);
    expect(openSettings).toHaveBeenCalledOnce();
  });
});

describe("the rate prompt", () => {
  it("stays away on a browser with no store page", () => {
    storage.showRateApp.mockReturnValue(true);
    renderCountdown();
    expect(screen.queryByText(RATE_APP)).toBeNull();
  });

  it("stays away until the extension has earned the ask", () => {
    review.url = STORE_URL;
    renderCountdown();
    expect(screen.queryByText(RATE_APP)).toBeNull();
  });

  it("links to the store page of the browser in use", () => {
    review.url = STORE_URL;
    storage.showRateApp.mockReturnValue(true);
    renderCountdown();
    const rateLink = screen.getByText(RATE_APP);
    expect(rateLink.getAttribute("href")).toBe(STORE_URL);
    expect(rateLink.getAttribute("target")).toBe("_blank");
    expect(rateLink.getAttribute("rel")).toBe("noreferrer");
  });

  it("remembers the review once the prompt is taken", () => {
    review.url = STORE_URL;
    storage.showRateApp.mockReturnValue(true);
    renderCountdown();
    fireEvent.click(screen.getByText(RATE_APP));
    expect(storage.setAppReviewed).toHaveBeenCalledOnce();
  });
});

describe("the colour scheme", () => {
  it("repaints every part of the readout when the system switches to dark mode", () => {
    review.url = STORE_URL;
    storage.showRateApp.mockReturnValue(true);
    renderCountdown();
    const [whole] = screen.getAllByTitle(COPY_LABEL);
    const rateLink = screen.getByText(RATE_APP);
    const lightAge = whole.parentElement?.style.color;
    const lightLabel = screen.getByText(AGE).parentElement?.style.color;
    const lightRateLink = rateLink.style.color;
    preferDarkMode(true);
    expect(whole.parentElement?.style.color).not.toBe(lightAge);
    expect(screen.getByText(AGE).parentElement?.style.color).not.toBe(
      lightLabel,
    );
    expect(rateLink.style.color).not.toBe(lightRateLink);
  });
});
