# Solid Motivation

[![Build Status](https://img.shields.io/github/actions/workflow/status/adipascu/solid-motivation/ci.yaml?branch=main&style=for-the-badge&logo=github)](https://github.com/adipascu/solid-motivation/actions/workflows/ci.yaml?query=branch%3Amain)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ebnfiihobaicohplfgeenddclnjblfkc?style=for-the-badge&logo=googlechrome&label=Chrome%20Users)](https://chrome.google.com/webstore/detail/solid-motivation/ebnfiihobaicohplfgeenddclnjblfkc)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/solid-motivation?style=for-the-badge&logo=firefox&label=Firefox%20Users)](https://addons.mozilla.org/en-US/firefox/addon/solid-motivation/)

A Chrome and Firefox extension that replaces the new tab page with your age in years, counting up in real time to eleven decimal places. It also runs as a plain web page at [adipascu.github.io/solid-motivation](https://adipascu.github.io/solid-motivation/).

![Screenshot of Solid Motivation](./docs/screenshot.svg)

<!-- markdownlint-disable MD033 -->

## Install

<div style="display: flex; flex-wrap: wrap; gap: 18px;">
  <a
    href="https://chrome.google.com/webstore/detail/solid-motivation/ebnfiihobaicohplfgeenddclnjblfkc"
  >
    <img
      alt="Available in the Chrome Web Store"
      src="https://github.com/user-attachments/assets/d984c54a-ce0b-4cb8-9158-0d0850d5fbde"
      style="max-width: 100%"
    />
  </a>
  <a
    href="https://addons.mozilla.org/en-US/firefox/addon/solid-motivation/"
  >
    <img
      alt="Get the add-on for Firefox"
      src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg"
      style="max-width: 100%; height: 96px"
    />
  </a>
</div>

## What it does

Enter your birthday once and every new tab shows how old you are.

- The counter repaints on every animation frame, so it stays smooth on high refresh rate screens
- The year rolls over at local midnight rather than at some fixed UTC offset, and leap day birthdays are handled
- Clicking the age copies it to the clipboard
- Light and dark themes follow the system setting
- The text is translated into 12 languages, picked from the browser's language preferences
- The birthday is stored in `localStorage`, and the extension builds also sync it across your devices with `chrome.storage.sync`

The extension asks for the `storage` permission and nothing else. Fonts are bundled, so it makes no network requests.

## Development

You need Node.js at the version in the `engines` field of `package.json`, and `pnpm` through corepack.

```sh
corepack enable
pnpm install
```

| Command | What it does |
| --- | --- |
| `pnpm start` | Vite dev server with hot reload |
| `pnpm build` | Production build into `dist/` |
| `pnpm test` | Vitest unit tests |
| `pnpm lint` | ESLint, warnings treated as errors |

Age arithmetic lives in [`src/calculate-age.ts`](src/calculate-age.ts). It uses [`temporal-polyfill`](https://github.com/fullcalendar/temporal-polyfill) so that time zones, DST and leap years are the library's problem rather than ours.

## Loading it unpacked

Run `pnpm build` first. The unpacked extension is the `dist/` directory, not the repository root.

In Chrome, open `chrome://extensions/`, turn on Developer Mode, click "Load unpacked" and pick `dist/`.

In Firefox, open `about:debugging`, click "This Firefox" then "Load Temporary Add-on", and pick `dist/manifest.json`.

## Releases

There is no manual release step. Every push to `main` that builds and passes tests is published by CI to the Chrome Web Store, to Firefox Add-ons, and to GitHub Pages. The version becomes `1.0.<CI run number>`, so even a documentation change ships a new version to both stores.

## Credits

Inspired by [maccman's Motivation](https://github.com/maccman/motivation). Built with [Solid.js](https://solidjs.com/).

## License

MIT, see [LICENSE](LICENSE).
