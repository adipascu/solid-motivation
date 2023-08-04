import { createSignal } from "solid-js";
import { getBirthDay } from "./storage";
import Settings from "./Settings";
import Countdown from "./Countdown";

export default () => {
  const birthday = getBirthDay();

  if (!birthday) {
    return <Settings />;
  }
  return <Countdown />;
};
