# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
