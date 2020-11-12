/**
 * Based on code from @docusaurus/theme-search-algolia
 * by Facebook, Inc., licensed under the MIT license.
 */

import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import lunr, { blogBasePath, docsBasePath, tokenize } from "../../generated";
import Mark from "mark.js";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory, useLocation } from "@docusaurus/router";
import {
  useVersions,
  useLatestVersion,
  useActiveVersion,
} from "@theme/hooks/useDocs";

import "./input.css";
import "./autocomplete.css";

const SEARCH_INDEX_AVAILABLE = process.env.NODE_ENV === "production";

function fetchIndex(baseUrl) {
  if (SEARCH_INDEX_AVAILABLE) {
    return fetch(`${baseUrl}search-index.json`)
      .then((content) => content.json())
      .then((json) => ({
        documents: json.documents,
        index: lunr.Index.load(json.index),
      }));
  } else {
    // The index does not exist in development, therefore load a dummy index here.
    return Promise.resolve({
      documents: [],
      index: lunr(function () {
        this.ref("id");
        this.field("title");
        this.field("content");
      }),
    });
  }
}

async function fetchAutoCompleteJS() {
  const autoComplete = await import("autocomplete.js");
  autoComplete.noConflict();
  return autoComplete.default;
}

function getQueryParamter(location, name) {
  let search = location.search;
  if (search.indexOf("?") === 0) {
    search = search.slice(1);
  }
  const prefix = `${name}=`;
  for (const pair of search.split("&")) {
    if (pair.startsWith(prefix)) {
      return pair.substr(prefix.length);
    }
  }
  return null;
}

function isDocsOrBlog(baseUrl) {
  return (
    window.location.pathname.startsWith(`${baseUrl}${docsBasePath}`) ||
    window.location.pathname.startsWith(`${baseUrl}${blogBasePath}`)
  );
}

function splitBySingleTildes(str) {
  // We cannot use lookbehind, since it is not supported in Safari
  // https://caniuse.com/js-regexp-lookbehind
  // return str.split(/(?<!~)~(?!~)/);

  const result = [];
  let current = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = i < str.length - 1 ? str[i + 1] : "";
    const prevChar = i > 0 ? str[i - 1] : "";
    if (char === "~" && nextChar !== "~" && prevChar !== "~") {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const Search = (props) => {
  const { isSearchBarExpanded, handleSearchBarToggle } = props;

  const indexState = useRef("empty"); // empty, loaded, done
  const searchBarRef = useRef(null);

  // Should the input be focused after the index is loaded?
  const focusAfterIndexLoaded = useRef(false);

  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const history = useHistory();
  const location = useLocation();

  const versions = useVersions();
  const activeVersion = useActiveVersion();
  const latestVersion = useLatestVersion();

  const versionToSearch =
    versions.length <= 1 ? undefined : activeVersion ?? latestVersion;

  // Highlight search results
  useEffect(() => {
    const param = getQueryParamter(location, "highlight");
    if (!param) {
      return;
    }
    let root;
    // Make sure to also adjust parse.js if you change the top element here.
    if (isDocsOrBlog(baseUrl)) {
      root = document.getElementsByTagName("article")[0];
    } else {
      root = document.getElementsByTagName("main")[0];
    }
    if (!root) {
      return;
    }
    const terms = splitBySingleTildes(param) // Split terms by "~" not preceded or followed by another "~"
      .filter((each) => each.length > 0)
      // Replace "~~" by a single "~" that it escaped
      .map((each) => each.replace(/~~/g, "~"));

    if (terms.length === 0) {
      return;
    }

    const mark = new Mark(root);
    const options = {
      ignoreJoiners: true,
    };
    mark.mark(terms, options);
    return () => mark.unmark(options);
  }, [location, baseUrl]);

  const loadIndex = async () => {
    if (indexState.current !== "empty") {
      // Do not load the index (again) if its already loaded or in the process of being loaded.
      return;
    }
    indexState.current = "loading";

    const [{ index, documents }, autoComplete] = await Promise.all([
      fetchIndex(baseUrl),
      fetchAutoCompleteJS(),
    ]);

    autoComplete(
      searchBarRef.current,
      {
        hint: false,
        autoselect: true,
        cssClasses: {
          root: "d-s-l-a",
        },
      },
      [
        {
          source: (input, cb) => {
            const terms = tokenize(input);
            const results = index
              .query((query) => {
                // Boost matches in title by 5
                query.term(terms, { fields: ["title"], boost: 5 });
                query.term(terms, {
                  fields: ["title"],
                  boost: 5,
                  wildcard: lunr.Query.wildcard.TRAILING,
                });
                // Boost matches in content by 1
                query.term(terms, { fields: ["content"], boost: 1 });
                query.term(terms, {
                  fields: ["content"],
                  boost: 1,
                  wildcard: lunr.Query.wildcard.TRAILING,
                });

                if (versionToSearch) {
                  query.term(versionToSearch.name, {
                    fields: ["version"],
                    boost: 0,
                    presence: lunr.Query.presence.REQUIRED,
                  });
                }
              })
              // We need to remove results with a score of 0 that occur
              // when the docs are versioned and just the version matches.
              .filter((result) => result.score > 0)
              .slice(0, 8)
              .map((result) => ({
                document: documents.find(
                  (document) => document.id.toString() === result.ref
                ),
                score: result.score,
                terms,
              }));
            cb(results);
          },
          templates: {
            suggestion: function ({ document, score }) {
              const escape = autoComplete.escapeHighlightedString;
              let result = `<span class="aa-suggestion-page">${escape(
                document.pageTitle
              )}</span>`;
              if (document.pageTitle !== document.sectionTitle) {
                result += `<span class="aa-suggestion-section">${escape(
                  document.sectionTitle
                )}</span>`;
              }
              // if (versionToSearch && document.docVersion !== undefined) {
              //   result += ` <span class="badge badge--secondary">${escape(
              //     document.docVersion
              //   )}</span>`;
              // }
              // result += " " + score;
              return result;
            },
            empty: () => {
              if (SEARCH_INDEX_AVAILABLE) {
                return `<span class="aa-suggestion-empty"></span>`;
              } else {
                return `<span class="aa-suggestion-empty">The search index is only available when you run docusaurus build! </span>`;
              }
            },
          },
        },
      ]
    ).on("autocomplete:selected", function (
      event,
      { document, terms },
      dataset,
      context
    ) {
      const [path, hash] = document.sectionRoute.split("#");
      let url = path;
      url +=
        "?highlight=" +
        encodeURIComponent(
          // Escape all "~" by "~~" and join terms by "~"
          terms.map((term) => term.replace(/~/g, "~~")).join("~")
        );
      if (hash) {
        url += "#" + hash;
      }
      history.push(url);
    });

    if (focusAfterIndexLoaded.current) {
      searchBarRef.current.focus();
    }
    indexState.current = "done";
  };

  const onInputFocus = () => {
    focusAfterIndexLoaded.current = true;
    loadIndex();
  };

  const onInputBlur = () => {
    handleSearchBarToggle(!isSearchBarExpanded);
  };

  const onInputMouseOver = () => {
    loadIndex();
  };

  const onIconClick = async () => {
    await loadIndex();

    searchBarRef.current.focus();

    handleSearchBarToggle(!isSearchBarExpanded);
  };

  let placeholder = "Search";
  if (versionToSearch) {
    placeholder += ` [${versionToSearch.label}]`;
  }

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={clsx("search-icon", {
          "search-icon-hidden": isSearchBarExpanded,
        })}
        onClick={onIconClick}
        onKeyDown={onIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder={placeholder}
        aria-label="Search"
        className={clsx(
          "navbar__search-input",
          { "search-bar-expanded": isSearchBarExpanded },
          { "search-bar": !isSearchBarExpanded }
        )}
        onMouseOver={onInputMouseOver}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={searchBarRef}
      />
    </div>
  );
};

export default Search;
