type Value = string | null;

export type Getter = (observer: (value: Value) => void) => () => void;
export type Setter = (value: Value) => Promise<void>;
