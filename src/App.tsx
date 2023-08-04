import { createSignal } from "solid-js";

export default () => {
  const [count, setCount] = createSignal(0);

  setInterval(() => {
    setCount(count() + 1);
  }, 1000);

  return (
    <div>
      <h1>Hello World</h1>
      <p>Count: {count()}</p>
    </div>
  );
};
