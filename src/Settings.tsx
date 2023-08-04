import { createSignal } from "solid-js";
import { setBirthDay } from "./storage";

export default () => {
  const [date, setDate] = createSignal<Date | null>(null);
  return (
    <div>
      <input
        type="date"
        onInput={(e) => {
          const date = new Date(e.currentTarget.value);
          if (isNaN(date.getTime())) {
            return;
          }
          setDate(date);
        }}
      />
      <button
        disabled={date() === null}
        onClick={() => {
          const inputDate = date();
          if (!inputDate) {
            throw new Error("Birthday not set");
          }
          setBirthDay(inputDate);
        }}
      >
        Motivate
      </button>
    </div>
  );
};
