import { describe, expect, it, vi } from "vitest";
import { ENTER_BIRTHDAY, LANGUAGE, TEXT_DIRECTION } from "./translation";

const startApp = () => {
  vi.resetModules();
  return import("./main");
};

describe("starting the extension", () => {
  it("mounts the app into the page and notes the build it came from", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await startApp();
    expect(document.body.textContent).toContain(ENTER_BIRTHDAY);
    expect(log).toHaveBeenCalledWith("Git hash", expect.any(String));
  });

  it("declares the language and reading direction on the document", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    vi.spyOn(console, "log").mockImplementation(() => {});
    await startApp();
    expect(document.documentElement.lang).toBe(LANGUAGE);
    expect(document.documentElement.dir).toBe(TEXT_DIRECTION);
  });

  it("refuses to start when the page has no root element", async () => {
    document.body.innerHTML = "";
    await expect(startApp()).rejects.toThrow("Root element not found");
  });
});
