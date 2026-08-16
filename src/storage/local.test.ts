import { describe, expect, it, vi } from "vitest";
import { getStoredValue, removeStoredValue, setStoredValue } from "./local";

const withDeniedStorage = async () => {
  const denied = Object.getOwnPropertyDescriptor(window, "localStorage");
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get: () => {
      throw new Error("SecurityError: access to storage is denied");
    },
  });
  vi.resetModules();
  const local = await import("./local");
  if (denied) {
    Object.defineProperty(window, "localStorage", denied);
  }
  return local;
};

describe("a browser that denies storage altogether", () => {
  it("reads null and writes nothing instead of blanking the page", async () => {
    const denied = await withDeniedStorage();
    expect(denied.getStoredValue("birthday")).toBeNull();
    expect(() => denied.setStoredValue("birthday", "1990-12-31")).not.toThrow();
    expect(() => denied.removeStoredValue("birthday")).not.toThrow();
  });
});

describe("getStoredValue", () => {
  it("returns null for a key that was never stored", () => {
    expect(getStoredValue("birthday")).toBeNull();
  });

  it("returns the stored value", () => {
    localStorage.setItem("birthday", "2000-01-01");
    expect(getStoredValue("birthday")).toBe("2000-01-01");
  });

  it("returns null rather than throwing when storage is denied", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("The operation is insecure");
    });
    expect(getStoredValue("birthday")).toBeNull();
  });
});

describe("setStoredValue", () => {
  it("keeps the value in local storage", () => {
    setStoredValue("birthday", "1990-12-31");
    expect(localStorage.getItem("birthday")).toBe("1990-12-31");
  });

  it("stays quiet when storage is denied", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => setStoredValue("birthday", "1990-12-31")).not.toThrow();
  });
});

describe("removeStoredValue", () => {
  it("forgets the stored value", () => {
    localStorage.setItem("birthday", "1990-12-31");
    removeStoredValue("birthday");
    expect(localStorage.getItem("birthday")).toBeNull();
  });

  it("stays quiet when storage is denied", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("The operation is insecure");
    });
    expect(() => removeStoredValue("birthday")).not.toThrow();
  });
});
