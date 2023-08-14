/* eslint-disable import/no-extraneous-dependencies */
import { UserConfig } from "vite";
import checkerPlugin from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";
// eslint-disable-next-line import/no-unresolved
import solidDevtoolsPlugin from "solid-devtools/vite";

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
  base: "./",
} satisfies UserConfig;
