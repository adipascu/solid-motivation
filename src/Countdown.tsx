import { createSignal, onCleanup } from "solid-js";
import { Temporal } from "temporal-polyfill";
import FONT_FAMILY from "./font";

const animationLoop = (cb: (time: DOMHighResTimeStamp) => void) => {
  let handle: number;
  const loop = (time: DOMHighResTimeStamp) => {
    cb(time);
    handle = requestAnimationFrame(loop);
  };
  handle = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(handle);
};

const midnightInstant = (date: Temporal.PlainDate) =>
  date.toZonedDateTime(Temporal.Now.timeZone()).toInstant();
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

  const largeAge = () => age().toFixed(11).split(".")[0];
  const smallAge = () => `.${age().toFixed(11).split(".")[1]}`;

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
      }}
    >
      <div>
        <div
          style={{
            "font-family": FONT_FAMILY,
            "font-size": "19.2px",
            "font-weight": "bold",
            "text-transform": "uppercase",
            color: "#B0B5B9",
            "margin-left": "4px",
          }}
        >
          Age
        </div>
        <div
          style={{
            display: "flex",
            "flex-direction": "row",
            "font-family": FONT_FAMILY,
            "font-size": "96px",
            "font-weight": "bold",
            "line-height": "0.8",
            color: "#494949",
          }}
        >
          <div>{largeAge()}</div>
          <div
            style={{
              "font-size": "38.4px",
              "margin-top": "5px",
              "line-height": "1",
              "margin-left": "7px",
              overflow: "hidden",
              "text-overflow": "ellipsis",
              width: "280px",
            }}
          >
            {smallAge()}
          </div>
        </div>
      </div>
    </div>
  );
};
