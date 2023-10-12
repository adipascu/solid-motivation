import getDarkMode from "./dark-signal";

export const colorPrimary = () => (getDarkMode() ? "#bab4ab" : "#494949");
export const colorSecondary = () => (getDarkMode() ? "#b9b3aa" : "#b0b5b9");
export const colorBackground = () => (getDarkMode() ? "#181a1b" : "#ffffff");
