/**
 * Based on code from @docusaurus/theme-search-algolia
 * by Facebook, Inc., licensed under the MIT license.
 */

import React, {useState, useRef, useCallback} from 'react';
import classnames from 'classnames';
import * as lunr from "lunr";

// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';

import './input.css';
import './autocomplete.css';

const Search = props => {
  const [indexState, setIndexState] = useState("empty");
  const searchBarRef = useRef(null);
  // const {siteConfig = {}} = useDocusaurusContext();
  // const {
  //   baseUrl,
  // } = siteConfig;
  const history = useHistory();

  const loadIndex = async () => {
    if (indexState !== "empty") {
      return;
    }
    setIndexState("loading");

    const indexLoaded = (index, documents, autoComplete) => {
      autoComplete.noConflict();

      autoComplete.default(
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
                .map(each => each.trim())
                .filter(each => each.length > 0);
              const results = index.query((query) => {
                query.term(terms)
                query.term(terms, { wildcard: lunr.Query.wildcard.TRAILING })
              }).slice(0, 8);
              cb(results);
            },
            templates: {
              suggestion: function(suggestion) {
                const document = documents.find(document => document.sectionRoute === suggestion.ref);
                return autoComplete.escapeHighlightedString(
                  `${document.pageTitle} >> ${document.sectionTitle}`
                );
              },
              empty: () => {
                return "no results"
              }
            }
          }
        ]
      ).on('autocomplete:selected', function(event, suggestion, dataset, context) {
        history.push(suggestion.ref);
      });
      setIndexState("done");
    }

    let indexPromise;

    if (process.env.NODE_ENV === "production") {
      indexPromise = fetch('search-index.json')
        .then(content => content.json())
        .then(json => ({ documents: json.documents, index: lunr.Index.load(json.index) }));
    } else {
      // The index does not exist in development, therefore load a dummy index here.
      indexPromise = Promise.resolve({
        documents: [],
        index: lunr(function () {
          this.ref("route");
          this.field("title");
          this.field("content");
        })
      });

      // indexPromise = import("./search-index.json")
      //   .then(data => data.default)
      //   .then(json => ({ documents: json.documents, index: lunr.Index.load(json.index) }));
    }

    const [{ index, documents }, autoComplete] = await Promise.all([
      indexPromise,
      import("autocomplete.js"),
    ]);
    indexLoaded(index, documents, autoComplete);
  };

  const toggleSearchIconClick = useCallback(() => {
    loadIndex();

    if (indexState === "done") {
      searchBarRef.current.focus();
    }

    props.handleSearchBarToggle(!props.isSearchBarExpanded);
  }, [props.isSearchBarExpanded, indexState]);

  const handleSearchInputBlur = useCallback(() => {
    props.handleSearchBarToggle(!props.isSearchBarExpanded);
  }, [props.isSearchBarExpanded]);

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={classnames('search-icon', {
          'search-icon-hidden': props.isSearchBarExpanded,
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={classnames(
          'navbar__search-input',
          {'search-bar-expanded': props.isSearchBarExpanded},
          {'search-bar': !props.isSearchBarExpanded},
        )}
        onMouseOver={loadIndex}
        onFocus={loadIndex}
        onBlur={handleSearchInputBlur}
        ref={searchBarRef}
      />
    </div>
  );
};

export default Search;