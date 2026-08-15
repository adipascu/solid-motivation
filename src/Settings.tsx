import { createSignal } from "solid-js";
import { Temporal } from "temporal-polyfill";
import FONT_FAMILY from "./font";
import { colorBackground, colorPrimary, colorSecondary } from "./colors";
import { ENTER_BIRTHDAY, MOTIVATE } from "./translation";
import { parsePlainDate } from "./parse-temporal";

const BIRTH_DAY_INPUT_ID = "birthday";

export default ({
  onBirthDay,
}: {
  onBirthDay: (birthDay: Temporal.PlainDate | null) => void;
}) => {
  const [date, setDate] = createSignal<Temporal.PlainDate | null>(null);
  const [isHovered, setIsHovered] = createSignal(false);

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center",
      }}
    >
      <label
        for={BIRTH_DAY_INPUT_ID}
        style={{
          "font-family": FONT_FAMILY,
          "font-size": "19.2px",
          "font-weight": "bold",
          color: colorPrimary(),
          "margin-bottom": "4px",
        }}
      >
        {ENTER_BIRTHDAY}
      </label>
      <input
        autofocus
        id={BIRTH_DAY_INPUT_ID}
        type="date"
        style={{
          "margin-bottom": "10px",
          padding: "10px",
          "font-size": "16px",
          border: "2px solid",
          "border-color": colorSecondary(),
          "border-radius": "4px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const inputDate = date();
            if (inputDate) {
              onBirthDay(inputDate);
            }
          }
        }}
        onInput={(e) => {
          setDate(parsePlainDate(e.currentTarget.value));
        }}
      />
      <button
        disabled={date() === null}
        onClick={() => {
          const inputDate = date();
          if (!inputDate) {
            throw new Error("Birthday not set");
          }
          onBirthDay(inputDate);
        }}
        style={{
          padding: "10px 20px",
          "font-size": "16px",
          "font-weight": "bold",
          "border-radius": "4px",
          border: "none",
          "background-color": colorPrimary(),
          color: colorBackground(),
          cursor: "pointer",
          opacity: isHovered() ? 0.85 : 1,
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {MOTIVATE}
      </button>
    </div>
  );
};
