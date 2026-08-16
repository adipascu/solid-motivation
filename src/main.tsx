import { render } from "solid-js/web";
import { Effect } from "effect";

import App from "./App";
import { GIT_HASH } from "./config";
import { LANGUAGE, TEXT_DIRECTION } from "./translation";

const mount = Effect.suspend(() => {
  const container = document.getElementById("app");
  if (!container) {
    return Effect.fail(new Error("Root element not found"));
  }
  document.documentElement.lang = LANGUAGE;
  document.documentElement.dir = TEXT_DIRECTION;
  render(() => <App />, container);
  return Effect.void;
});

Effect.runSync(mount);

// eslint-disable-next-line no-console
console.log("Git hash", GIT_HASH);
