import { Show } from "solid-js";
import Settings from "./Settings";
import Countdown from "./Countdown";
import { getBirthDay, setBirthDay } from "./storage";

export default () => (
  <Show
    when={getBirthDay()}
    fallback={
      <Settings
        onBirthDay={(newBirthDay) => {
          setBirthDay(newBirthDay);
        }}
      />
    }
  >
    {(birthDay) => (
      <Countdown
        birthDay={birthDay()}
        openSettings={() => {
          setBirthDay(null);
        }}
      />
    )}
  </Show>
);
