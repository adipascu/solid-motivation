import { UserConfig } from 'vite';
import checkerPlugin from 'vite-plugin-checker'
// import devtools from 'solid-devtools/vite';

export default {
  plugins: [
    checkerPlugin({
      typescript: true
    })
  ],
} satisfies UserConfig
