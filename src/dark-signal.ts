import { createSignal } from "solid-js";

const query = window.matchMedia("(prefers-color-scheme: dark)");

const [getDarkMode, setDarkMode] = createSignal(query.matches);

query.addEventListener("change", (e) => setDarkMode(e.matches));

export default getDarkMode;
