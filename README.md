# Offline / Local Search for Docusaurus v2

![Version](https://img.shields.io/npm/v/@cmfcmf/docusaurus-search-local?style=flat-square)
![License](https://img.shields.io/npm/l/@cmfcmf/docusaurus-search-local?style=flat-square)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub issues](https://img.shields.io/github/issues/cmfcmf/docusaurus-search-local?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/cmfcmf/docusaurus-search-local?style=flat-square)

Offline / local search for Docusaurus **v2** that works behind your firewall.

![Search in Action](docs/preview.gif)

## Installation

```bash
yarn add @cmfcmf/docusaurus-search-local
```

or

```bash
npm install @cmfcmf/docusaurus-search-local
```

## Usage

Add this plugin to the `plugins` array in `docusaurus.config.js`.

```js
module.exports = {
  // ...
  plugins: [
    '@cmfcmf/docusaurus-search-local'
  ],

  // or, if you want to specify options:

  // ...
  plugins: [
    ['@cmfcmf/docusaurus-search-local', {
      // Options here
    }]
  ],
}
```

The following options are available (defaults are shown below):

```js
{
  blogBasePath: '/blog', // must correspond to the base path configured for the blog plugin
  docsBasePath: '/docs', // must correspond to the base path configured for the docs plugin
  indexBlog: true, // whether to index blog pages
  indexDocs: true, // whether to index docs pages
  indexPages: false, // whether to index static pages
  // /404.html is never indexed
}
```

You can now use the search bar to search your documentation.

**Important: Search only works for the statically built documentation (i.e., after you ran `yarn build` in your documentation folder).**

**Search does **not** work in development (i.e., when running `yarn start`).**

## License

MIT
