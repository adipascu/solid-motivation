import { createSignal, onCleanup } from "solid-js";
import { Temporal } from "temporal-polyfill";
import { IoSettingsSharp } from "solid-icons/io";
import toast, { Toaster } from "solid-toast";
import FONT_FAMILY from "./font";
import { GIT_HASH } from "./config";
import { calculateAgeLocal } from "./calculate-age";
import { colorBackground, colorPrimary, colorSecondary } from "./colors";
import {
  AGE,
  COPY_LABEL,
  SOURCE_CODE,
  BIRTH_DAY_FORMAT,
  AGE_COPIED,
  AGE_COPY_FAILED,
} from "./translation";

const animationLoop = (cb: (time: DOMHighResTimeStamp) => void) => {
  let handle: number;
  const loop = (time: DOMHighResTimeStamp) => {
    cb(time);
    handle = requestAnimationFrame(loop);
  };
  handle = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(handle);
};

export default ({
  birthDay,
  openSettings,
}: {
  birthDay: Temporal.PlainDate;
  openSettings: () => void;
}) => {
  const [age, setAge] = createSignal<number>(calculateAgeLocal(birthDay));
  const [isHovered, setIsHovered] = createSignal(false);

  const handle = animationLoop(() => {
    setAge(calculateAgeLocal(birthDay));
  });
  onCleanup(handle);

  const largeAge = () => Math.floor(age()).toString();
  const smallAge = () => age().toFixed(11).split(".")[1];

  const copyAgeToClipboard = async () => {
    const ageString = `${largeAge()}.${smallAge()}`;
    try {
      await navigator.clipboard.writeText(ageString);
      toast.success(AGE_COPIED);
    } catch (err) {
      toast.error(AGE_COPY_FAILED);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "background-color": colorBackground(),
      }}
    >
      <Toaster position="top-center" />
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
            color: colorSecondary(),
            "margin-left": "4px",
          }}
          title={BIRTH_DAY_FORMAT(birthDay)}
        >
          <div onClick={copyAgeToClipboard}>{AGE}</div>
          <IoSettingsSharp
            fill={colorSecondary()}
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
            "user-select": "none",
            cursor: "text",
            overflow: "hidden",
            color: colorPrimary(),
          }}
        >
          <div onClick={copyAgeToClipboard} title={COPY_LABEL}>
            {largeAge()}
          </div>
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
            }}
          >
            <div
              onClick={copyAgeToClipboard}
              title={COPY_LABEL}
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
                color: colorPrimary(),
                "margin-left": "9px",
                opacity: isHovered() ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
              title={GIT_HASH}
            >
              {`(${SOURCE_CODE})`}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
