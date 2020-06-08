/**
 * Based on code from @docusaurus/theme-search-algolia
 * by Facebook, Inc., licensed under the MIT license.
 */

import React, { useRef, useEffect } from "react";
import classnames from "classnames";
import lunr, { blogBasePath, docsBasePath } from "../../generated";
import Mark from "mark.js";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory, useLocation } from "@docusaurus/router";

import "./input.css";
import "./autocomplete.css";

function fetchIndex(baseUrl) {
  if (process.env.NODE_ENV === "production") {
    return fetch(`${baseUrl}search-index.json`)
      .then(content => content.json())
      .then(json => ({
        documents: json.documents,
        index: lunr.Index.load(json.index)
      }));
  } else {
    // The index does not exist in development, therefore load a dummy index here.
    return Promise.resolve({
      documents: [],
      index: lunr(function() {
        this.ref("id");
        this.field("title");
        this.field("content");
      })
    });
  }
}

async function fetchAutoCompleteJS() {
  const autoComplete = await import("autocomplete.js");
  autoComplete.noConflict();
  return autoComplete.default;
}

function getQueryParamter(name) {
  let search = window.location.search;
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

const Search = props => {
  const { isSearchBarExpanded, handleSearchBarToggle } = props;
  const indexState = useRef("empty"); // empty, loaded, done
  const searchBarRef = useRef(null);
  const {
    siteConfig: { baseUrl }
  } = useDocusaurusContext();
  const history = useHistory();
  const location = useLocation();

  // Should the input be focused after the index is loaded?
  const focusAfterIndexLoaded = useRef(false);

  useEffect(() => {
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
    const param = getQueryParamter("highlight");
    if (!param) {
      return;
    }
    const terms = param
      // Split terms by "~" not preceded or followed by another "~"
      .split(/(?<!~)~(?!~)/)
      .filter(each => each.length > 0)
      // Replace "~~" by a single "~" that it escaped
      .map(each => each.replace(/~~/g, "~"));

    if (terms.length === 0) {
      return;
    }

    const mark = new Mark(root);
    const options = {
      ignoreJoiners: true
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
      fetchAutoCompleteJS()
    ]);

    autoComplete(
      searchBarRef.current,
      {
        hint: false,
        autoselect: true,
        cssClasses: {
          root: "d-s-l-a"
        }
      },
      [
        {
          source: (input, cb) => {
            const terms = input
              .split(" ")
              .map(each => each.trim().toLowerCase())
              .filter(each => each.length > 0);
            const results = index
              .query(query => {
                query.term(terms);
                query.term(terms, { wildcard: lunr.Query.wildcard.TRAILING });
              })
              .slice(0, 8)
              .map(result => ({
                document: documents.find(
                  document => document.id.toString() === result.ref
                ),
                terms
              }));
            cb(results);
          },
          templates: {
            suggestion: function({ document }) {
              const escape = autoComplete.escapeHighlightedString;
              let result = `<span class="aa-suggestion-page">${escape(
                document.pageTitle
              )}</span>`;
              if (document.pageTitle !== document.sectionTitle) {
                result = `${result}<span class="aa-suggestion-section">${escape(
                  document.sectionTitle
                )}</span>`;
              }
              return result;
            },
            empty: () => {
              return `<span class="aa-suggestion-empty"></span>`;
            }
          }
        }
      ]
    ).on("autocomplete:selected", function(
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
          terms.map(term => term.replace(/~/g, "~~")).join("~")
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

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={classnames("search-icon", {
          "search-icon-hidden": isSearchBarExpanded
        })}
        onClick={onIconClick}
        onKeyDown={onIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={classnames(
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
