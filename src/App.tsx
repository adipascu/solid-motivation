import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Temporal } from "temporal-polyfill";
import Settings from "./Settings";
import Countdown from "./Countdown";
import { getBirthDay, setBirthDay } from "./storage";

export default () => {
  const [getValue, setValue] = createSignal<Temporal.PlainDate | null>(
    getBirthDay(),
  );

  let initialRender = true;

  createEffect(() => {
    const value = getValue();
    if (initialRender) {
      initialRender = false;
      return;
    }
    setBirthDay(value);
  });

  onCleanup(() => {
    initialRender = false;
  });
  return (
    <Show
      when={getValue()}
      fallback={
        <Settings
          onBirthDay={(newBirthDay) => {
            setValue(newBirthDay);
          }}
        />
      }
    >
      {(birthDay) => (
        <Countdown
          birthDay={birthDay()}
          openSettings={() => {
            setValue(null);
          }}
        />
      )}
    </Show>
  );
};
