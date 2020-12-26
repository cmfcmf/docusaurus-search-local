# 0.4.1

- FIX: Correctly handle "/" as docsRouteBasePath and blogRouteBasePath

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