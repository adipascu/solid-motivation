import Settings from "./Settings";
import Countdown from "./Countdown";
import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Temporal } from "temporal-polyfill";
import { getBirthDay, setBirthDay } from "./storage";

export default () => {
  const [getValue, setValue] = createSignal<Temporal.PlainDate | null>(
    getBirthDay()
  );

  let initialRender = true;

  createEffect(() => {
    if (initialRender) {
      initialRender = false;
      return;
    }
    setBirthDay(getValue());
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
    {
      (birthDay) => <Countdown birthDay={birthDay()} />
    }
    </Show>
  );
};
