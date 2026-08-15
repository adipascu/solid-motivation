import { describe, expect, it } from "vitest";
import { getLocalValue, setLocalValue } from "./browser";

describe("getLocalValue", () => {
  it("returns null before a birthday has ever been entered", () => {
    expect(getLocalValue()).toBeNull();
  });

  it("returns the birthday kept in local storage", () => {
    localStorage.setItem("birthday", "2000-01-01");
    expect(getLocalValue()).toBe("2000-01-01");
  });
});

describe("setLocalValue", () => {
  it("keeps the birthday in local storage", () => {
    setLocalValue("1990-12-31");
    expect(localStorage.getItem("birthday")).toBe("1990-12-31");
  });

  it("forgets the birthday when it is cleared", () => {
    localStorage.setItem("birthday", "1990-12-31");
    setLocalValue(null);
    expect(localStorage.getItem("birthday")).toBeNull();
  });
});
