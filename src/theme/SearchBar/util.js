// FIXME: Duplicated in src/index.js
function urlMatchesPrefix(url, prefix) {
  if (prefix.endsWith("/")) {
    throw new Error(`prefix must not end with a /. This is a bug.`);
  }
  return url === prefix || url.startsWith(`${prefix}/`);
}

export function determineDocsVersionFromURL(
  path,
  basePath,
  docsBaseRoutePath,
  versions
) {
  // Array of versions that have route prefixes.
  // The latest version (version[0]) has no route prefix.
  const routeBasedVersions = ["next", ...versions.slice(1)];
  for (const version of routeBasedVersions) {
    if (urlMatchesPrefix(path, `${basePath}${docsBaseRoutePath}/${version}`)) {
      return version;
    }
  }
  return versions[0];
}
