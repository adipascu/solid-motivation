import { render } from "solid-js/web";

import App from "./App";
import { GIT_HASH } from "./config";

const container = document.getElementById("app");

if (!container) {
  throw new Error("Root element not found");
}

render(() => <App />, container);

// eslint-disable-next-line no-console
console.log("Git hash", GIT_HASH);
