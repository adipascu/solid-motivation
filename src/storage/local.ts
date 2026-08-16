import { KeyValueStore } from "@effect/platform";
import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Effect, Option } from "effect";

const store: KeyValueStore.KeyValueStore | null = Effect.runSync(
  KeyValueStore.KeyValueStore.pipe(
    Effect.provide(BrowserKeyValueStore.layerLocalStorage),
    Effect.catchAllCause(() => Effect.succeed(null)),
  ),
);

const runAgainstStore = <A>(
  use: (store: KeyValueStore.KeyValueStore) => Effect.Effect<A, unknown>,
  whenUnavailable: A,
) =>
  store === null
    ? whenUnavailable
    : Effect.runSync(
        use(store).pipe(
          Effect.catchAllCause(() => Effect.succeed(whenUnavailable)),
        ),
      );

export const getStoredValue = (key: string) =>
  runAgainstStore(
    (available) => available.get(key).pipe(Effect.map(Option.getOrNull)),
    null,
  );

export const setStoredValue = (key: string, value: string) =>
  runAgainstStore((available) => available.set(key, value), undefined);

export const removeStoredValue = (key: string) =>
  runAgainstStore((available) => available.remove(key), undefined);
