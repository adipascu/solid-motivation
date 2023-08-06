import { createSignal, onCleanup } from "solid-js";
import { getBirthDay } from "./storage";
import { Temporal } from "temporal-polyfill";
const animationLoop = (cb: (time: DOMHighResTimeStamp) => void) => {
  let handle: number;
  const loop = (time: DOMHighResTimeStamp) => {
    cb(time);
    handle = requestAnimationFrame(loop);
  };
  handle = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(handle);
};

const midnightInstant = (date: Temporal.PlainDate) => {
  return date.toZonedDateTime(Temporal.Now.timeZone()).toInstant();
};
const calculateAge = (birthDay: Temporal.PlainDate) =>
  Temporal.Now.instant().since(midnightInstant(birthDay)).total({
    unit: "years",
    relativeTo: birthDay,
  });
export default ({ birthDay }: { birthDay: Temporal.PlainDate }) => {
  const [age, setAge] = createSignal<number>(calculateAge(birthDay));

  const handle = animationLoop(() => {
    setAge(calculateAge(birthDay));
  });
  onCleanup(handle);

  return (
    <div>
      <p>age {age().toFixed(11)}</p>
    </div>
  );
};
