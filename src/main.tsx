import { render } from "solid-js/web";

import App from "./App";

const container = document.getElementById("app");

if (!container) {
  throw new Error("Root element not found");
}

render(() => <App />, container);
