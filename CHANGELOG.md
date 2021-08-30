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