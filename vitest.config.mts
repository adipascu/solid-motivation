import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import gitHash from "./git-hash";

export default defineConfig({
  plugins: [solidPlugin({ hot: false })],
  resolve: {
    conditions: ["browser", "development"],
  },
  define: {
    __GIT_HASH__: JSON.stringify(gitHash()),
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-helpers/setup.ts"],
    server: {
      deps: {
        inline: ["solid-js", "@solidjs/testing-library"],
      },
    },
    restoreMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test-helpers/**"],
      thresholds: {
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 100,
      },
    },
  },
});
