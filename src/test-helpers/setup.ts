import { beforeEach } from "vitest";
import { preferDarkMode, stubColorSchemeQuery } from "./color-scheme";

stubColorSchemeQuery();

beforeEach(() => {
  localStorage.clear();
  preferDarkMode(false);
});
