# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
