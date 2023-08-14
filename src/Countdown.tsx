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
export default ({
  birthDay,
  openSettings,
}: {
  birthDay: Temporal.PlainDate;
  openSettings: () => void;
}) => {
  const [age, setAge] = createSignal<number>(calculateAge(birthDay));
  const [isHovered, setIsHovered] = createSignal(false);

  const handle = animationLoop(() => {
    setAge(calculateAge(birthDay));
  });
  onCleanup(handle);

  const largeAge = () => Math.floor(age()).toString();
  const smallAge = () => age().toFixed(11).split(".")[1];

  return (
    <div
      style={{
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      }}
    >
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
          <span>Age</span>{" "}
          <span
            style={{
              opacity: isHovered() ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              cursor: "pointer",
            }}
            onClick={openSettings}
            title={`Birthday: ${birthDay.toLocaleString()}`}
          >
            ⚙️
          </span>
        </div>
        <div
          style={{
            display: "flex",
            "flex-direction": "row",
            "font-family": FONT_FAMILY,
            "font-size": "96px",
            "font-weight": "bold",
            "line-height": "0.85",
            overflow: "hidden",
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
            .{smallAge()}
          </div>
        </div>
      </div>
    </div>
  );
};
