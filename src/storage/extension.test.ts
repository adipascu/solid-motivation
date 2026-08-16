import { describe, expect, it, vi } from "vitest";
import { Effect } from "effect";
import { stubChrome } from "../test-helpers/chrome";

const loadExtensionStorage = async (initialSync: Record<string, unknown>) => {
  const chrome = stubChrome(initialSync);
  vi.resetModules();
  return { chrome, ...(await import("./extension")) };
};

describe("getValue", () => {
  it("reports the birthday already synced to the account", async () => {
    const { getValue } = await loadExtensionStorage({ birthday: "1990-05-04" });
    const observer = vi.fn();
    getValue(observer);
    expect(observer).toHaveBeenCalledWith("1990-05-04");
  });

  it("reports null when the account holds no birthday", async () => {
    const { getValue } = await loadExtensionStorage({});
    const observer = vi.fn();
    getValue(observer);
    expect(observer).toHaveBeenCalledWith(null);
  });

  it("reports a birthday synced from another device", async () => {
    const { chrome, getValue } = await loadExtensionStorage({});
    const observer = vi.fn();
    getValue(observer);
    chrome.emitChange({ birthday: { newValue: "2001-02-03" } }, "sync");
    expect(observer).toHaveBeenLastCalledWith("2001-02-03");
  });

  it("reports null when the birthday is cleared on another device", async () => {
    const { chrome, getValue } = await loadExtensionStorage({
      birthday: "1990-05-04",
    });
    const observer = vi.fn();
    getValue(observer);
    chrome.emitChange({ birthday: {} }, "sync");
    expect(observer).toHaveBeenLastCalledWith(null);
  });

  it("ignores changes to other keys and other storage areas", async () => {
    const { chrome, getValue } = await loadExtensionStorage({});
    const observer = vi.fn();
    getValue(observer);
    observer.mockClear();
    chrome.emitChange({ install_date: { newValue: "2020-01-01" } }, "sync");
    chrome.emitChange({ birthday: { newValue: "2001-02-03" } }, "local");
    expect(observer).not.toHaveBeenCalled();
  });

  it("stops listening once the subscription is dropped", async () => {
    const { chrome, getValue } = await loadExtensionStorage({});
    const observer = vi.fn();
    const unsubscribe = getValue(observer);
    unsubscribe();
    observer.mockClear();
    chrome.emitChange({ birthday: { newValue: "2001-02-03" } }, "sync");
    expect(observer).not.toHaveBeenCalled();
    expect(chrome.storage.onChanged.removeListener).toHaveBeenCalledOnce();
  });
});

describe("setValue", () => {
  it("syncs the birthday to the account", async () => {
    const { chrome, setValue } = await loadExtensionStorage({});
    await expect(
      Effect.runPromise(setValue("1990-05-04")),
    ).resolves.toBeUndefined();
    expect(chrome.sync).toEqual({ birthday: "1990-05-04" });
  });

  it("removes the birthday from the account when it is cleared", async () => {
    const { chrome, setValue } = await loadExtensionStorage({
      birthday: "1990-05-04",
    });
    await expect(Effect.runPromise(setValue(null))).resolves.toBeUndefined();
    expect(chrome.sync).toEqual({});
  });

  it("rejects when the account refuses the write", async () => {
    const { chrome, setValue } = await loadExtensionStorage({});
    chrome.failWrites("QUOTA_BYTES_PER_ITEM quota exceeded");
    await expect(Effect.runPromise(setValue("1990-05-04"))).rejects.toThrow(
      "QUOTA_BYTES_PER_ITEM quota exceeded",
    );
  });

  it("still names the failure when the account gives no reason", async () => {
    const { chrome, setValue } = await loadExtensionStorage({});
    chrome.failWrites();
    await expect(Effect.runPromise(setValue("1990-05-04"))).rejects.toThrow(
      "chrome.storage.sync refused",
    );
  });

  it("rejects when the account refuses the removal", async () => {
    const { chrome, setValue } = await loadExtensionStorage({
      birthday: "1990-05-04",
    });
    chrome.failWrites("MAX_WRITE_OPERATIONS_PER_MINUTE quota exceeded");
    await expect(Effect.runPromise(setValue(null))).rejects.toThrow(
      "MAX_WRITE_OPERATIONS_PER_MINUTE quota exceeded",
    );
  });
});
