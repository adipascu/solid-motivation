type Value = string | null;

export type Getter = (key: string) => Promise<Value>;
export type Setter = (key: string, value: Value) => Promise<void>;
