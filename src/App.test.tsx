import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Temporal } from "temporal-polyfill";
import App from "./App";
import { AGE, ENTER_BIRTHDAY, SETTINGS_LABEL } from "./translation";

type StoredBirthDay = { current: Temporal.PlainDate | null };

const stored = vi.hoisted((): StoredBirthDay => ({ current: null }));
const setBirthDay = vi.hoisted(() =>
  vi.fn<(birthDay: Temporal.PlainDate | null) => void>(),
);

vi.mock("./storage", () => ({
  getBirthDay: () => stored.current,
  setBirthDay,
  showRateApp: () => false,
  setAppReviewed: () => {},
}));

const BIRTH_DAY = "1990-05-04";

beforeEach(() => {
  stored.current = null;
  setBirthDay.mockReset();
});

afterEach(cleanup);

describe("before a birthday is known", () => {
  it("asks for one", () => {
    render(() => <App />);
    expect(screen.getByText(ENTER_BIRTHDAY)).toBeDefined();
  });

  it("stores the birthday that is entered", () => {
    const { container } = render(() => <App />);
    const input = container.querySelector("input");
    const submit = container.querySelector("button");
    if (!input || !submit) {
      throw new Error("the birthday prompt rendered without its controls");
    }
    fireEvent.input(input, { target: { value: BIRTH_DAY } });
    fireEvent.click(submit);
    expect(setBirthDay.mock.calls[0][0]?.toJSON()).toBe(BIRTH_DAY);
  });
});

describe("once a birthday is known", () => {
  it("counts up from it", () => {
    stored.current = Temporal.PlainDate.from(BIRTH_DAY);
    render(() => <App />);
    expect(screen.getByText(AGE)).toBeDefined();
  });

  it("forgets the birthday when the settings are reopened", () => {
    stored.current = Temporal.PlainDate.from(BIRTH_DAY);
    render(() => <App />);
    fireEvent.click(screen.getByRole("button", { name: SETTINGS_LABEL }));
    expect(setBirthDay).toHaveBeenCalledWith(null);
  });
});
