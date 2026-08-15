import { render } from "solid-js/web";

import App from "./App";
import { GIT_HASH } from "./config";
import { LANGUAGE, TEXT_DIRECTION } from "./translation";

const container = document.getElementById("app");

if (!container) {
  throw new Error("Root element not found");
}

document.documentElement.lang = LANGUAGE;
document.documentElement.dir = TEXT_DIRECTION;

render(() => <App />, container);

// eslint-disable-next-line no-console
console.log("Git hash", GIT_HASH);
