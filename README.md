# Offline / Local Search for Docusaurus v2

Offline / local search for Docusaurus **v2** that works behind your firewall.

## Installation

```bash
yarn add @cmfcmf/docusaurus-search-local
```

or

```bash
npm install @cmfcmf/docusaurus-search-local
```

## Usage

Add this plugin to the `plugins` array in `docusaurus.config.js`:

```js
module.exports = {
  // ...
  plugins: [
    '@cmfcmf/docusaurus-search-local'
  ],
  // ...
}
```

You can now use the search bar to search your documentation.

**Important: Search only works for the statically built documentation (i.e., after you ran `yarn build` in your documentation folder).**

**Search does **not** work in development (i.e., when running `yarn start`).**

## License

MIT
