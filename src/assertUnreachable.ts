export default function assertUnreachable(value: never): never {
  throw new Error(`This value is unsupported ${value}`);
}
