import { createSignal } from "solid-js";
import { Temporal } from "temporal-polyfill";

export default ({
  onBirthDay,
}: {
  onBirthDay: (birthDay: Temporal.PlainDate | null) => void;
}) => {
  const [date, setDate] = createSignal<Temporal.PlainDate | null>(null);
  return (
    <div>
      <input
        autofocus
        type="date"
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
      >
        Motivate
      </button>
    </div>
  );
};
