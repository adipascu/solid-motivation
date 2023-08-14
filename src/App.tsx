import {
  Show,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
} from "solid-js";
import { Temporal } from "temporal-polyfill";
import Settings from "./Settings";
import Countdown from "./Countdown";
import { BirthDay, getBirthDay, setBirthDay } from "./storage";

export default () => {
  const [getValue, { refetch }] = createResource<BirthDay, BirthDay>(
    async (source, { refetching }) => {
      if (typeof refetching !== "boolean") {
        await setBirthDay(refetching);
        return refetching;
      }
      return getBirthDay();
    },
  );

  const setValue = (newBirthDay: Temporal.PlainDate | null) => {
    refetch(newBirthDay);
  };
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
