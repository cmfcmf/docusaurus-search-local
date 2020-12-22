# Offline / Local Search for Docusaurus v2

![Version](https://img.shields.io/npm/v/@cmfcmf/docusaurus-search-local?style=flat-square)
![License](https://img.shields.io/npm/l/@cmfcmf/docusaurus-search-local?style=flat-square)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub issues](https://img.shields.io/github/issues/cmfcmf/docusaurus-search-local?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/cmfcmf/docusaurus-search-local?style=flat-square)

Offline / local search for Docusaurus **v2** that works behind your firewall.

Feature Highlights:
- Supports multiple documentation versions
- Supports documentation written in languages other than English
- Highlights search results
- Customized parsers for docs, blogs, and general pages
- Lazy-loads the index

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
    require.resolve('@cmfcmf/docusaurus-search-local')
  ],

  // or, if you want to specify options:

  // ...
  plugins: [
    [require.resolve('@cmfcmf/docusaurus-search-local'), {
      // Options here
    }]
  ],
}
```

The following options are available (defaults are shown below):

```js
{
  blogRouteBasePath: '/blog', // must correspond to the base route path configured for the blog plugin
  docsRouteBasePath: '/docs', // must correspond to the base route path configured for the docs plugin
  indexBlog: true, // whether to index blog pages
  indexDocs: true, // whether to index docs pages
  indexPages: false, // whether to index static pages
  // /404.html is never indexed
  language: "en", // language of your documentation, see next section
  docsOnlyMode: false // set this to true if you use docs onyl mode
}
```

You can now use the search bar to search your documentation.

**Important: Search only works for the statically built documentation (i.e., after you ran `yarn build` in your documentation folder).**

**Search does **not** work in development (i.e., when running `yarn start`).**

### Non-English Documentation

Use the `language` option if your documentation is not written in English. You can either specify a single language or an array of multiple languages.
The following languages are available:

    ar, da, de, en, es, fi, fr, hu, it, ja, nl, no, pt, ro, ru, sv, th, tr, vi

### Documentation Versions

Documentation versions created with the official Docusaurus docs plugin are supported.
The search bar defaults to the latest version (not `next`, but the latest version defined in `versions.json`) when not on a documentation page (e.g., when looking at a blog post or a static page).
If the user visits a documentation page, the version is extracted from the URL and search will only search documentatio of that version.
The searchbar placeholder text always reflects the currently detected documentation version.

### Debugging

If building your documentation produces an error, you can build it in debug mode to figure out
which page is causing it. To do so, simply set the `DEBUG` environment variable when building
your documentation: `DEBUG=1 yarn build`.

## CONTRIBUTING

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for further information.

## License

MIT
