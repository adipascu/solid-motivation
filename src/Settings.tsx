import { createSignal } from "solid-js";
import { Temporal } from "temporal-polyfill";
import FONT_FAMILY from "./font";
import { colorBackground, colorPrimary, colorSecondary } from "./colors";
import { ENTER_BIRTHDAY, MOTIVATE } from "./translation";

export default ({
  onBirthDay,
}: {
  onBirthDay: (birthDay: Temporal.PlainDate | null) => void;
}) => {
  const [date, setDate] = createSignal<Temporal.PlainDate | null>(null);

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
          setDate(Temporal.PlainDate.from(e.currentTarget.value));
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
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colorPrimary();
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = colorSecondary();
        }}
      >
        {MOTIVATE}
      </button>
    </div>
  );
};
