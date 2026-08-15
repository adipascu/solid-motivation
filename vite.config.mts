import { UserConfig } from "vite";
import checkerPlugin from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";
import solidDevtoolsPlugin from "solid-devtools/vite";
import gitHash from "./git-hash";

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
