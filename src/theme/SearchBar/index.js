/**
 * Based on code from @docusaurus/theme-search-algolia
 * by Facebook, Inc., licensed under the MIT license.
 */

import React, {useRef} from 'react';
import classnames from 'classnames';
import * as lunr from "lunr";

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';

import './input.css';
import './autocomplete.css';

function fetchIndex(baseUrl) {
  if (process.env.NODE_ENV === "production") {
    return fetch(`${baseUrl}search-index.json`)
      .then(content => content.json())
      .then(json => ({ documents: json.documents, index: lunr.Index.load(json.index) }));
  } else {
    // The index does not exist in development, therefore load a dummy index here.
    return Promise.resolve({
      documents: [],
      index: lunr(function () {
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

const Search = props => {
  const { isSearchBarExpanded, handleSearchBarToggle } = props;
  const indexState = useRef("empty"); // empty, loaded, done
  const searchBarRef = useRef(null);
  const { siteConfig: { baseUrl }} = useDocusaurusContext();
  const history = useHistory();
  // Should the input be focused after the index is loaded?
  const focusAfterIndexLoaded = useRef(false);

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
              .query((query) => {
                query.term(terms)
                query.term(terms, { wildcard: lunr.Query.wildcard.TRAILING })
              })
              .slice(0, 8)
              .map(result => documents.find(document => document.id.toString() === result.ref));
            cb(results);
          },
          templates: {
            suggestion: function(document) {
              return autoComplete.escapeHighlightedString(
                document.pageTitle === document.sectionTitle
                  ? document.sectionTitle
                  : `${document.pageTitle} >> ${document.sectionTitle}`
              );
            },
            empty: () => {
              return "no results"
            }
          }
        }
      ]
    ).on('autocomplete:selected', function(event, document, dataset, context) {
      history.push(document.sectionRoute);
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
        className={classnames('search-icon', {
          'search-icon-hidden': isSearchBarExpanded,
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
          'navbar__search-input',
          {'search-bar-expanded': isSearchBarExpanded},
          {'search-bar': !isSearchBarExpanded},
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