import { createSignal, onCleanup } from "solid-js";
import { Temporal } from "temporal-polyfill";
import { IoSettingsSharp } from "solid-icons/io";
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

  const COLOR_COUNTER = "#494949";
  const COLOR_LABEL = "#B0B5B9";
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
            display: "flex",
            "flex-direction": "row",
            "font-family": FONT_FAMILY,
            "font-size": "19.2px",
            "font-weight": "bold",
            "text-transform": "uppercase",
            color: COLOR_LABEL,
            "margin-left": "4px",
          }}
        >
          <div>Age</div>
          <IoSettingsSharp
            fill={COLOR_LABEL}
            style={{
              "margin-top": "3px",
              "margin-left": "4px",
              opacity: isHovered() ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              cursor: "pointer",
            }}
            onClick={openSettings}
            title={`Birthday: ${birthDay.toLocaleString()}`}
          />
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
            color: COLOR_COUNTER,
          }}
        >
          <div>{largeAge()}</div>
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
            }}
          >
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
            <a
              href="https://github.com/adipascu/solid-motivation"
              style={{
                "font-size": "14px",
                color: COLOR_COUNTER,
                "margin-left": "9px",
                opacity: isHovered() ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
            >
              (source code)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
