/* eslint-disable import/no-extraneous-dependencies */
import { execSync } from "node:child_process";
import { UserConfig } from "vite";
import checkerPlugin from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";
// eslint-disable-next-line import/no-unresolved
import solidDevtoolsPlugin from "solid-devtools/vite";

const gitHash = () => execSync("git rev-parse --short HEAD").toString().trim();

// eslint-disable-next-line import/no-unused-modules
export default {
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
} satisfies UserConfig;
