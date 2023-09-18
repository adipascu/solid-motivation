import { createSignal, onCleanup } from "solid-js";
import { Temporal } from "temporal-polyfill";
import { IoSettingsSharp } from "solid-icons/io";
import FONT_FAMILY from "./font";
import getDarkMode from "./dark-signal";
import { GIT_HASH } from "./config";

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

  const colorLabel = () => (getDarkMode() ? "#b9b3aa" : "#b0b5b9");
  const colorCounter = () => (getDarkMode() ? "#bab4ab" : "#494949");
  const colorBackground = () => (getDarkMode() ? "#181a1b" : "#ffffff");
  return (
    <div
      style={{
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "background-color": colorBackground(),
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
            color: colorLabel(),
            "margin-left": "4px",
          }}
          title={`Birthday: ${birthDay.toLocaleString()}`}
        >
          <div>Age</div>
          <IoSettingsSharp
            fill={colorLabel()}
            style={{
              "margin-top": "3px",
              "margin-left": "4px",
              opacity: isHovered() ? 1 : 0,
              transition:
                "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
              cursor: "pointer",
              transform: isHovered() ? "rotate(0deg)" : "rotate(-30deg)",
            }}
            onClick={openSettings}
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
            color: colorCounter(),
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
                color: colorCounter(),
                "margin-left": "9px",
                opacity: isHovered() ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
              title={GIT_HASH}
            >
              (source code)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
