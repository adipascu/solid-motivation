# Solid Motivation - Browser Extension

Solid Motivation is a browser extension available for both Chrome and Firefox. It transforms your new tab page into a real-time counter displaying your age — in years, down to many decimal places. Every fraction of a second counts, emphasizing the urgency of time and inspiring you to live every moment to the fullest. This extension is powered by [Solid.JS](https://solidjs.com/) and is deeply influenced by [maccman's Motivation](https://github.com/maccman/motivation) extension.

<!-- markdownlint-disable MD033 -->

## Extension stores

<div style="display: flex; flex-wrap: wrap; gap: 18px;">
  <a
    href="https://chrome.google.com/webstore/detail/solid-motivation/ebnfiihobaicohplfgeenddclnjblfkc"
  >
    <img
      src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/iNEddTyWiMfLSwFD6qGq.png"
      style="max-width: 100%"
    />
  </a>
  <a
    href="https://addons.mozilla.org/en-US/firefox/addon/solid-motivation/"
  >
    <img
      src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg"
      style="max-width: 100%; height: 96px"
    />
  </a>
</div>

## Screenshot

![Screenshot of Solid Motivation](./docs/screenshot.svg)

## Features

- Displays your age in real-time years, meticulously detailed down to numerous decimal places.
- Elegant and distraction-free design, focusing solely on the essence of time.
- Built harnessing the capabilities of [Solid.JS](https://solidjs.com/).

## Development and Build Instructions

Before diving into the steps, ensure that you have `Node.js` and `pnpm` installed. We recommend using a node version manager to handle the Node.js version and `corepack` to ensure the correct `pnpm` version.

### Setup

1. **Node Version Management**:

   If you aren't already using a node version manager, consider using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) or [n](https://github.com/tj/n). This helps you manage and switch between multiple Node.js versions with ease.

   Once you have a version manager installed, set the Node.js version for this project based on the `engines` field in the `package.json`.
   Run `nvm use` or `n auto` .

2. **Install Corepack (If not already installed)**:

   Corepack provides a zero-runtime-dependency method to invoke package managers. It's bundled with Node.js, so if you have Node.js installed, you should be good to go. If you need to install or update it manually: `npm install -g corepack`

3. **Setup PNPM via Corepack**:

   Corepack will ensure you're using the right version of `pnpm` as defined in the project's configuration. Run `corepack enable`.

### Dependency Installation

Install the project dependencies: `pnpm install`

### Building the Project

- **For Development**, this will start the development server, which typically offers hot-reloading: `pnpm start`

- **For Production**, this will create an optimized build of the project suitable for deployment: `pnpm build`

## Installation

### Chrome

1. Clone the repository: `git clone https://github.com/adipascu/solid-motivation.git`
2. Navigate to `chrome://extensions/` in Chrome.
3. Enable Developer Mode by toggling the switch at the top right.
4. Click on the `Load unpacked` button and select the directory where you cloned the repository.

### Firefox

1. Clone the repository: `git clone https://github.com/adipascu/solid-motivation.git`
2. Open Firefox and navigate to `about:debugging`.
3. Click "This Firefox" and then "Load Temporary Add-on".
4. Navigate to the directory where you cloned the repository and select the appropriate manifest or zip file.

## Usage

1. Once the extension is activated, each new tab will present the Solid Motivation page, precisely showcasing your age.
2. To set your birthdate, access the settings icon or the relevant UI component.

## Credits

- **Inspiration**: [Motivation by maccman](https://github.com/maccman/motivation) | [Chrome Store Link](https://chrome.google.com/webstore/detail/motivation/ofdgfpchbidcgncgfpdlpclnpaemakoj)
- **Framework**: [Solid.JS](https://solidjs.com/)

## Contributing

Interested in making a contribution? Here's how:

1. Fork the repository (`https://github.com/adipascu/solid-motivation/fork`)
2. Create a feature branch (`git checkout -b feature/fooBar`)
3. Commit your modifications (`git commit -am 'Introduce fooBar'`)
4. Push to your branch (`git push origin feature/fooBar`)
5. Craft a new Pull Request

## License

This project is covered under the MIT License. For more details, refer to the [LICENSE](LICENSE) file.
