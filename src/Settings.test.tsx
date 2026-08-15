import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Temporal } from "temporal-polyfill";
import Settings from "./Settings";
import { ENTER_BIRTHDAY, MOTIVATE } from "./translation";
import { colorPrimary } from "./colors";
import { preferDarkMode } from "./test-helpers/color-scheme";

const BIRTH_DAY = "1990-05-04";

const asRenderedColor = (color: string) => {
  const probe = document.createElement("div");
  probe.style.backgroundColor = color;
  return probe.style.backgroundColor;
};

const renderSettings = () => {
  const onBirthDay = vi.fn<(birthDay: Temporal.PlainDate | null) => void>();
  const { container } = render(() => <Settings onBirthDay={onBirthDay} />);
  const input = container.querySelector("input");
  const submit = container.querySelector("button");
  if (!input || !submit) {
    throw new Error("Settings rendered without its form controls");
  }
  return { container, onBirthDay, input, submit };
};

afterEach(cleanup);

describe("the birthday prompt", () => {
  it("asks for a birthday and keeps the button out of reach until one is given", () => {
    const { input, submit } = renderSettings();
    expect(screen.getByLabelText(ENTER_BIRTHDAY)).toBe(input);
    expect(submit.textContent).toBe(MOTIVATE);
    expect(submit.disabled).toBe(true);
  });

  it("enables the button once a birthday is entered", () => {
    const { input, submit } = renderSettings();
    fireEvent.input(input, { target: { value: BIRTH_DAY } });
    expect(submit.disabled).toBe(false);
  });

  it("reports the birthday when the button is clicked", () => {
    const { onBirthDay, input, submit } = renderSettings();
    fireEvent.input(input, { target: { value: BIRTH_DAY } });
    fireEvent.click(submit);
    expect(onBirthDay).toHaveBeenCalledOnce();
    expect(onBirthDay.mock.calls[0][0]?.toJSON()).toBe(BIRTH_DAY);
  });

  it("reports the birthday when Enter is pressed in the field", () => {
    const { onBirthDay, input } = renderSettings();
    fireEvent.input(input, { target: { value: BIRTH_DAY } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onBirthDay.mock.calls[0][0]?.toJSON()).toBe(BIRTH_DAY);
  });

  it("ignores Enter while the field is still empty", () => {
    const { onBirthDay, input } = renderSettings();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onBirthDay).not.toHaveBeenCalled();
  });

  it("ignores keys other than Enter", () => {
    const { onBirthDay, input } = renderSettings();
    fireEvent.input(input, { target: { value: BIRTH_DAY } });
    fireEvent.keyDown(input, { key: "a" });
    expect(onBirthDay).not.toHaveBeenCalled();
  });

  it("ignores a birthday the field cannot parse", () => {
    const { onBirthDay, input, submit } = renderSettings();
    fireEvent.input(input, { target: { value: BIRTH_DAY } });
    fireEvent.input(input, { target: { value: "" } });
    expect(submit.disabled).toBe(true);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onBirthDay).not.toHaveBeenCalled();
  });

  it("dims the button while the pointer rests on it", () => {
    const { input, submit } = renderSettings();
    fireEvent.input(input, { target: { value: BIRTH_DAY } });
    expect(submit.style.opacity).toBe("1");
    fireEvent.mouseEnter(submit);
    expect(submit.style.opacity).toBe("0.85");
    fireEvent.mouseLeave(submit);
    expect(submit.style.opacity).toBe("1");
  });

  it("repaints itself when the system switches to dark mode", () => {
    const { container, submit } = renderSettings();
    const label = container.querySelector("label");
    const lightLabel = label?.style.color;
    preferDarkMode(true);
    expect(label?.style.color).not.toBe(lightLabel);
    expect(label?.style.color).toBe(asRenderedColor(colorPrimary()));
    expect(submit.style.backgroundColor).toBe(asRenderedColor(colorPrimary()));
  });
});
