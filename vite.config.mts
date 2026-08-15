import { execSync } from "node:child_process";
import { defineConfig } from "vitest/config";
import checkerPlugin from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";
// eslint-disable-next-line import/no-unresolved
import solidDevtoolsPlugin from "solid-devtools/vite";

const gitHash = () => execSync("git rev-parse --short HEAD").toString().trim();

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    checkerPlugin({
      typescript: true,
    }),
    solidDevtoolsPlugin(),
    solidPlugin(),
  ],
  define: {
    __GIT_HASH__: JSON.stringify(gitHash()),
  },
  base: "./",
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
