# Change Log

All notable changes to this project will be documented in this file.
This change log is automatically generated based on commit messags. See
[Commit Message Guidelines](CONTRIBUTING.md#commit-message-guidelines)
for more information.

## [1.1.0](https://github.com/cmfcmf/docusaurus-search-local/compare/v1.0.0...v1.1.0) (2023-04-10)

### Features

- Add Dutch translations ([#178](https://github.com/cmfcmf/docusaurus-search-local/issues/178)) ([0c3b492](https://github.com/cmfcmf/docusaurus-search-local/commit/0c3b492ecaeb8969f69cd27de98576b5e20c26a8))

### Bug Fixes

- Re-add support for using this plugin on Windows ([0337ada](https://github.com/cmfcmf/docusaurus-search-local/commit/0337ada1ecf3e188eac636dfbc47a363a72008e6)), closes [#175](https://github.com/cmfcmf/docusaurus-search-local/issues/175) [#179](https://github.com/cmfcmf/docusaurus-search-local/issues/179)

## [1.0.0](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.11.0...v1.0.0) (2023-02-26)

### ⚠ BREAKING CHANGES

- The minimum supported Docusaurus version is now v2.0.0.

### Features

- Add Danish translations ([deb44b7](https://github.com/cmfcmf/docusaurus-search-local/commit/deb44b7e20e08747b4e7a744e7d21a88e338903b))
- Create Norwegian translation ([f1833f3](https://github.com/cmfcmf/docusaurus-search-local/commit/f1833f3da543b7f723e04bd0ff9f5d0fd511f686))
- Create Russion translation, closes [#158](https://github.com/cmfcmf/docusaurus-search-local/issues/158) ([9917a13](https://github.com/cmfcmf/docusaurus-search-local/commit/9917a135651f1ab292a8f27e6e3b57af12d94265))
- Create Taiwanese translation ([4437359](https://github.com/cmfcmf/docusaurus-search-local/commit/4437359eca9396603f574396bd6609587222ee25))
- Create Thai translation ([#164](https://github.com/cmfcmf/docusaurus-search-local/issues/164)) ([ba2d41e](https://github.com/cmfcmf/docusaurus-search-local/commit/ba2d41ebf45f10e2810a44d6800daca18d03f17a))

### Bug Fixes

- Correctly extract page titles when not specified in frontmatter, closes [#146](https://github.com/cmfcmf/docusaurus-search-local/issues/146) ([1f33151](https://github.com/cmfcmf/docusaurus-search-local/commit/1f33151bbef355a82361734f434e65af624b5ac2))
- Do not generate .d.ts files, which break `docusaurus write-translations`, closes [#145](https://github.com/cmfcmf/docusaurus-search-local/issues/145), [#129](https://github.com/cmfcmf/docusaurus-search-local/issues/129), [#163](https://github.com/cmfcmf/docusaurus-search-local/issues/163), [#167](https://github.com/cmfcmf/docusaurus-search-local/issues/167) ([c09cc94](https://github.com/cmfcmf/docusaurus-search-local/commit/c09cc942bd2e4078fcd517b965f63848079f5007))
- Fix potential error when calculating paths, closes [#136](https://github.com/cmfcmf/docusaurus-search-local/issues/136) ([26f1b71](https://github.com/cmfcmf/docusaurus-search-local/commit/26f1b7132087211ef4211f60f55dbe3d9ab4b2fe))
- Resolve warning regarding `render` parameter in autocomplete, closes [#148](https://github.com/cmfcmf/docusaurus-search-local/issues/148) ([66d41e4](https://github.com/cmfcmf/docusaurus-search-local/commit/66d41e479f8fab7be13047d1761b1e4f6be562c9))
- Support Yarn pnp, closes [#139](https://github.com/cmfcmf/docusaurus-search-local/issues/139) ([045d534](https://github.com/cmfcmf/docusaurus-search-local/commit/045d5346470eea2a5a30dd944e138ef0c5400032))

### Other

- Update to Docusaurus v2 ([f8619b7](https://github.com/cmfcmf/docusaurus-search-local/commit/f8619b72ec748ac084b53cf7c88157419a27863a))

# [0.11.0](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.10.0...v0.11.0) (2022-06-12)

### Bug Fixes

- Correct alignment of search input, closes [#117](https://github.com/cmfcmf/docusaurus-search-local/issues/117) ([f29dc02](https://github.com/cmfcmf/docusaurus-search-local/commit/f29dc02c475980509599018bae3ff45beecad6f3))

### chore

- Update dependencies ([1fe21f7](https://github.com/cmfcmf/docusaurus-search-local/commit/1fe21f768b957140ad9fcbd1ac05cebfbee48b3a))

### Features

- Add Czech translation ([#115](https://github.com/cmfcmf/docusaurus-search-local/issues/115)) ([cc7c724](https://github.com/cmfcmf/docusaurus-search-local/commit/cc7c7249b3e28cf5cb3c958932144618cd211ae6))
- Add Slowak translation ([#116](https://github.com/cmfcmf/docusaurus-search-local/issues/116)) ([970ba86](https://github.com/cmfcmf/docusaurus-search-local/commit/970ba8656bd1380385e3bd7ea10009fa3c108d4f))
- Add Swedish Translation ([#105](https://github.com/cmfcmf/docusaurus-search-local/issues/105)) ([72fdcd8](https://github.com/cmfcmf/docusaurus-search-local/commit/72fdcd80c555a70d4791a5930083fe93ed8c2e7d))
- Make number of search results configurable, closes [#122](https://github.com/cmfcmf/docusaurus-search-local/issues/122) ([a9d2faa](https://github.com/cmfcmf/docusaurus-search-local/commit/a9d2faa3847f9762e8498c253b89f04bdaf7ab2a))
- support Docusaurus v2.0.0-beta.17, update dependencies, closes [#102](https://github.com/cmfcmf/docusaurus-search-local/issues/102), closes [#99](https://github.com/cmfcmf/docusaurus-search-local/issues/99) ([84c72c3](https://github.com/cmfcmf/docusaurus-search-local/commit/84c72c3d98c6e0d578c7799274f4a33a896c1425))
- Support indexing of docs and blog tags, closes [#121](https://github.com/cmfcmf/docusaurus-search-local/issues/121) ([df0a81e](https://github.com/cmfcmf/docusaurus-search-local/commit/df0a81ee07c84f15c8d0095e31aa827a45289c19))

### BREAKING CHANGES

- The default height of the search input is now 36px. Use
  the --aa-search-input-height CSS variable to adjust it if needed.
- The minimum supported Docusaurus version is now v2.0.0-beta21
- the minimum supported Docusaurus version is now v2.0.0-beta17.

# [0.10.0](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.9.4...v0.10.0) (2022-01-28)

### Features

- Add polish translations :poland: ([#95](https://github.com/cmfcmf/docusaurus-search-local/issues/95)) ([e947ad1](https://github.com/cmfcmf/docusaurus-search-local/commit/e947ad108738445b6cafe6537531e72418c9e411))
- support Docusaurus v2.0.0-beta.15, fixes [#93](https://github.com/cmfcmf/docusaurus-search-local/issues/93) ([30a6c66](https://github.com/cmfcmf/docusaurus-search-local/commit/30a6c66e974df0536a51399bd18ba5458d1c62a8))

### BREAKING CHANGES

- the minimum supported Docusaurus version is now v2.0.0-beta15.

## [0.9.4](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.9.3...v0.9.4) (2022-01-19)

### Bug Fixes

- Return EMPTY_INDEX when server responds with error. ([#91](https://github.com/cmfcmf/docusaurus-search-local/issues/91)) ([1a4d89c](https://github.com/cmfcmf/docusaurus-search-local/commit/1a4d89c77ff7bb029386de50d2a1b1e5dc7e95b3))

## [0.9.3](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.9.2...v0.9.3) (2022-01-13)

### Bug Fixes

- wrong variable when checking available documentation plugins ([8b04bbf](https://github.com/cmfcmf/docusaurus-search-local/commit/8b04bbfa277b1a7afd4aeecae48e52f68f4d4f77))

## [0.9.2](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.9.1...v0.9.2) (2021-12-14)

### Bug Fixes

- support trailingSlash = false ([371d60a](https://github.com/cmfcmf/docusaurus-search-local/commit/371d60accd03bbd3465f2d771b476f673b6ce022)), closes [#52](https://github.com/cmfcmf/docusaurus-search-local/issues/52)

## [0.9.1](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.9.0...v0.9.1) (2021-12-14)

### Bug Fixes

- do not throw error if a search index does not exist ([9a17de6](https://github.com/cmfcmf/docusaurus-search-local/commit/9a17de64d4bfac192d319bd7126af6a1843c0965)), closes [#85](https://github.com/cmfcmf/docusaurus-search-local/issues/85)

### Features

- update @algolia/autocomplete-js to 1.5.1 ([5631755](https://github.com/cmfcmf/docusaurus-search-local/commit/5631755cf13b8610e2a68f7a1298f3f97f8568bb))

# [0.9.0](https://github.com/cmfcmf/docusaurus-search-local/compare/v0.8.0...v0.9.0) (2021-12-11)

### Features

- split indexes by plugin and documentation versions ([2953045](https://github.com/cmfcmf/docusaurus-search-local/commit/295304582682d6bd27839454f609dc0e88d029a2))
- support up to Docusaurus v2.0.0-beta13 ([e74750f](https://github.com/cmfcmf/docusaurus-search-local/commit/e74750f5ea906f759a8b5c81c7397d12f4d6de9e)), closes [#82](https://github.com/cmfcmf/docusaurus-search-local/issues/82) [#83](https://github.com/cmfcmf/docusaurus-search-local/issues/83)

### BREAKING CHANGES

- the minimum supported Docusaurus version is now v2.0.0-beta9.

# 0.8.0

- FEAT: Support multiple docs, blogs, and pages plugins (#33)

# 0.7.0

- FEAT: Infer `docsPath`, `docsRouteBasePath`, and `blogRouteBasePath` from Docusaurus context
- FEAT: Make similarity tuning parameters and boosting behavior of title vs content vs parent categories configurable (#67)
- FEAT: Align documentation version detection with [DocsVersionNavbarItem](https://github.com/facebook/docusaurus/blob/fcaa94695d76ad508ff4dcdc1a2cabbe1a22650e/packages/docusaurus-theme-classic/src/theme/NavbarItem/DocsVersionNavbarItem.tsx)
- FIX: Correctly exclude tags pages of both docs and blogs, respect `tagsBasePath` if configured
- BREAKING: Now requires Docusaurus v2.0.0-beta4 or later
- BREAKING: Now requires at least Node.js 14
- CLEANUP: Reorganize repository layout, use yarn workspaces

# 0.6.7

- FEAT: Add support for Bahasa Indonesia (`id`)
- FEAT: Support Docusaurus v2.0.0-beta7

# 0.6.6

- FEAT: Support Docusaurus v2.0.0-beta5

# 0.6.5

- FEAT: Add additional translations of autocomplete (Spanish, French, Japanese, and Portugese) (#56)

# 0.6.4

- FIX: Re-add support for Chinese (`zh`)

# 0.6.3

- FIX: Correctly handle [trailingSlash config option](https://docusaurus.io/docs/docusaurus.config.js/#trailing-slash) (#52)
- FEAT: Fully localized autocomplete (currently in German, English, Italian, Brazilian Portuguese, and Chinese), update autocomplete to 1.2.2
- FEAT: Support Hindi for search indexing (`hi`)
- FEAT: Validate plugin options (#46)

# 0.6.2

- FEAT: Italian translations
- FIX: Missing peer dependency warnings
- FIX: Correct Docusaurus peer dependency version (#36)
- BREAKING: Now requires Docusaurus v2.0.0-beta0

# 0.6.1

- FIX: Add missing codeTranslations folder to release package

# 0.6.0

- BREAKING: Now requires Docusaurus v2.0.0-alpha73
- BREAKING: Update autocomplete.js to v1-alpha, which features an all-new design and renamed class names (#32).
- FEAT: Use i18n system for translation of the searchbar itself, translate to German and English (#29)
  - BREAKING: To specfiy a non-default placeholder if no results are found, overwrite the newly introduced translation keys instead of `.d-s-l-a .aa-dropdown-menu .aa-suggestion-empty::after { content: "No results"; }`
- FEAT: Yellow result higlighting no longer adds a parameter to the URL and vanishes on refresh (#28)
- FIX: Support for language th

# 0.5.0

- FIX: Correctly handle "/" as docsRouteBasePath and blogRouteBasePath (#21)
- FIX: Exclude hash link "#" from HTML headings when indexing
- FIX: Use same tokenizer that was used for indexing documents to tokenize the content of the search box
- FEAT: Allow to specify a different separator for the tokenizer (#20)
- FEAT: Find blog posts and static pages regardless of the currently selected documentation version (#19)
- FEAT: For docs, optionally also index the titles of parent categories in the sidebar (#17)

# 0.4.0

- BREAKING: Now requires Docusaurus v2.0.0-alpha66
- FEAT: Upgrade to new version APIs from v2.0.0-alpha66

# 0.3.1

- FIX: Search did not work in Safari (#18)

# 0.3.0

- FEAT: Support versioned documentation
- BREAKING: Renamed options
  - `blogBasePath` to `blogRouteBasePath`
  - `docsBasePath` to `docsRouteBasePath`
- BREAKING: Now requires Docusaurus v2.0.0-alpha.59
- FIX: Remove version badge from search index
- FIX: Correct docs/blog/page detection logic for edge cases (e.g., `/docs-foo-bar` is no longer considered a documentation page)
- FIX: Use correct plugin name
- FIX: Japanese and Thai search should now work correctly (#12)

# 0.2.0

- FEAT: Highlight search results on the page using a new `highlight` query parameter

# 0.1.3

- FIX: `<style>` and `<script>` tags no longer break indexing (#7)

# 0.1.2

- FEAT: Make search results easier to style, improve markup (#6)

# 0.1.1

- FIX: Parsing of empty sections and pages
- FIX: Parsing static pages was broken
- FEAT: Add logging

# 0.1.0

- FEAT: Support for indexing other languages than English (#3)
- FEAT: New options to configure indexing.
- FIX: Navigation buttons are no longer included in indexed text (#4).
- BREAKING: Static pages are no longer indexed by default

# 0.0.5

- FIX: Set different dropdown colors in dark theme.

# 0.0.4

- FIX: Focus search bar after loading the index if it was previously focused.
- FEAT: Introduce document ids to make index smaller

# 0.0.3

- FIX: Lowercase all search terms before searching the index. A search term with an uppercase letter never gives any results, because the index is all lowercase.
- FEAT: If document and section titles are equal, only display one of them in search results.

# 0.0.2

- FIX: Prepend baseUrl when fetching search index.
- FEAT: Add more fields to package.json.

# 0.0.1

- Initial version
