import { UserConfig } from 'vite';
import checkerPlugin from 'vite-plugin-checker'
import solidPlugin from 'vite-plugin-solid';
import solidDevtoolsPlugin from 'solid-devtools/vite';

export default {
  plugins: [
    checkerPlugin({
      typescript: true
    }),
    solidDevtoolsPlugin(),
    solidPlugin(),
  ],
} satisfies UserConfig
