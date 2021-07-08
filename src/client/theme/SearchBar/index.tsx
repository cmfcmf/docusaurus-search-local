import React, { useRef, useEffect, createElement, Fragment } from "react";
import { render } from "react-dom";
import { autocomplete, AutocompleteApi } from "@algolia/autocomplete-js";
import type lunr from "lunr";
import Head from "@docusaurus/Head";
import { interpolate } from "@docusaurus/Interpolate";
import { translate } from "@docusaurus/Translate";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  useVersions,
  useLatestVersion,
  useActiveVersion,
} from "@theme/hooks/useDocs";
import useThemeContext from "@theme/hooks/useThemeContext";
import {
  mylunr,
  indexDocSidebarParentCategories,
  tokenize,
} from "./generatedWrapper";
import { HighlightSearchResults } from "./HighlightSearchResults";

const SEARCH_INDEX_AVAILABLE = process.env.NODE_ENV === "production";

type MyDocument = {
  id: number;
  pageTitle: string;
  sectionTitle: string;
  sectionRoute: string;
};

type MyItem = {
  document: MyDocument;
  score: number;
  terms: string[];
};

function getItemUrl({ document }: MyItem) {
  const [path, hash] = document.sectionRoute.split("#");
  let url = path;
  if (hash) {
    url += "#" + hash;
  }
  return url;
}

function fetchIndex(baseUrl: string) {
  if (SEARCH_INDEX_AVAILABLE) {
    return fetch(`${baseUrl}search-index.json`)
      .then((content) => content.json())
      .then((json) => ({
        documents: json.documents as MyDocument[],
        index: mylunr.Index.load(json.index),
      }));
  } else {
    // The index does not exist in development, therefore load a dummy index here.
    return Promise.resolve({
      documents: [],
      index: mylunr(function () {
        this.ref("id");
        this.field("title");
        this.field("content");
      }),
    });
  }
}

const SearchBar = () => {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const history = useHistory<{ cmfcmfhighlight?: string[] }>();

  const versions: { name: string; label: string }[] = useVersions();
  const activeVersion: { name: string; label: string } | undefined =
    useActiveVersion();
  const latestVersion: { name: string; label: string } | undefined =
    useLatestVersion();
  const versionToSearch =
    versions.length <= 1 ? undefined : activeVersion ?? latestVersion;

  const index = useRef<
    | null
    | "loading"
    | {
        documents: MyDocument[];
        index: lunr.Index;
      }
  >(null);

  const getIndex = async () => {
    if (index.current !== null && index.current !== "loading") {
      // Do not load the index (again) if its already loaded or in the process of being loaded.
      return index.current;
    }
    index.current = "loading";
    return (index.current = await fetchIndex(baseUrl));
  };

  const placeholder = versionToSearch
    ? interpolate(
        translate({
          message: "cmfcmf/d-s-l.searchBar.placeholderWithVersion",
          description:
            "Placeholder shown in the searchbar if it is empty and no documentation version has been detected",
        }),
        { version: versionToSearch.label }
      )
    : translate({
        message: "cmfcmf/d-s-l.searchBar.placeholderWithoutVersion",
        description:
          "Placeholder shown in the searchbar if it is empty and a documentation version has been detected (available in the {version} placeholder",
      });

  const autocompleteRef = useRef<HTMLDivElement>(null);
  const autocompleteApi = useRef<AutocompleteApi<MyItem> | null>(null);

  useEffect(() => {
    if (!autocompleteRef.current) {
      return;
    }

    autocompleteApi.current = autocomplete<MyItem>({
      container: autocompleteRef.current,
      placeholder,
      // Use React instead of Preact
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children as any, root);
      },
      // Use react-router for navigation
      navigator: {
        navigate({ item, itemUrl }) {
          history.push(itemUrl, { cmfcmfhighlight: item.terms });
        },
      },
      // always open a modal window
      detachedMediaQuery: "",
      // preselect the first search result
      defaultActiveItemId: 0,

      translations: {
        clearButtonTitle: translate({
          message: "cmfcmf/d-s-l.searchBar.clearButtonTitle",
          description: "Title of the button to clear the current search input",
        }),
        detachedCancelButtonText: translate({
          message: "cmfcmf/d-s-l.searchBar.detachedCancelButtonText",
          description: "Text of the button to close the detached search window",
        }),
        submitButtonTitle: translate({
          message: "cmfcmf/d-s-l.searchBar.submitButtonTitle",
          description: "Title of the button to submit a new search",
        }),
      },

      getSources({ query: input }) {
        return [
          {
            sourceId: "search-results",
            templates: {
              // footer() {
              //   return <h1>footer</h1>
              // },
              // header() {
              //   return <h1>header</h1>
              // },
              item({ item }) {
                // if (versionToSearch && document.docVersion !== undefined) {
                //   result += ` <span class="badge badge--secondary">${escape(
                //     document.docVersion
                //   )}</span>`;
                // }
                // result += " " + score;

                const url = getItemUrl(item);
                return (
                  // We cannot use <Link>, because this stuff is rendered in a completely separate React tree and has no access to the Router and DocusaurusContext.
                  <a
                    href={url}
                    className="aa-ItemLink"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(url, { cmfcmfhighlight: item.terms });
                    }}
                  >
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentTitle">
                        {item.document.sectionTitle}
                      </div>
                      {item.document.pageTitle !==
                        item.document.sectionTitle && (
                        <div className="aa-ItemContentDescription">
                          {item.document.pageTitle}
                        </div>
                      )}
                    </div>
                    <div className="aa-ItemActions">
                      <button
                        className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                        type="button"
                        title="Select"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="currentColor"
                        >
                          <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
                        </svg>
                      </button>
                    </div>
                  </a>
                );
              },
              noResults() {
                return (
                  <div className="aa-ItemContent">
                    {SEARCH_INDEX_AVAILABLE
                      ? translate({
                          message: "cmfcmf/d-s-l.searchBar.noResults",
                          description: "message shown if no results are found",
                        })
                      : // No need to translate this message, since its only shown in development.
                        "The search index is only available when you run docusaurus build!"}
                  </div>
                );
              },
            },
            getItemUrl({ item }) {
              return getItemUrl(item);
            },
            async getItems() {
              const { documents, index } = await getIndex();
              const terms = tokenize(input);
              const results = index
                .query((query) => {
                  // Boost matches in title by 5
                  query.term(terms, { fields: ["title"], boost: 5 });
                  query.term(terms, {
                    fields: ["title"],
                    boost: 5,
                    wildcard: mylunr.Query.wildcard.TRAILING,
                  });
                  // Boost matches in content by 1
                  query.term(terms, { fields: ["content"], boost: 1 });
                  query.term(terms, {
                    fields: ["content"],
                    boost: 1,
                    wildcard: mylunr.Query.wildcard.TRAILING,
                  });

                  if (indexDocSidebarParentCategories) {
                    query.term(terms, {
                      fields: ["sidebarParentCategories"],
                      boost: 2,
                    });
                    query.term(terms, {
                      fields: ["sidebarParentCategories"],
                      boost: 2,
                      wildcard: mylunr.Query.wildcard.TRAILING,
                    });
                  }

                  if (versionToSearch) {
                    // We want to search all documents with version = versionToSearch OR version = undefined
                    // (blog posts and static pages have an undefined version)
                    //
                    // Since lunr.js does not allow OR queries, we instead prohibit all versions
                    // except versionToSearch and undefined.
                    //
                    // https://github.com/cmfcmf/docusaurus-search-local/issues/19
                    versions.forEach((version) => {
                      if (version.name !== versionToSearch.name) {
                        query.term(version.name, {
                          fields: ["version"],
                          boost: 0,
                          presence: mylunr.Query.presence.PROHIBITED,
                        });
                      }
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
                  )!,
                  score: result.score,
                  terms,
                }));

              // if (!SEARCH_INDEX_AVAILABLE) {
              //   results.push({
              //     score: 0.5,
              //     document: {
              //       id: 1,
              //       pageTitle: "BLOG POST TITLE",
              //       sectionTitle: "BLOG POST TITLE",
              //       sectionRoute: "/blog/d-s-l-test",
              //     },
              //     terms: ["a", "b"],
              //   });
              // }

              return results;
            },
          },
        ];
      },
    });

    return () => autocompleteApi.current?.destroy();
  }, []);

  useEffect(() => {
    if (autocompleteApi.current) {
      autocompleteApi.current.update({
        placeholder,
      });
    }
  }, [placeholder]);

  const isDarkTheme = useThemeContext().isDarkTheme;

  return (
    <>
      <Head>
        {/*
          Needed by the autocomplete for dark mode support
          https://autocomplete.algolia.com/docs/autocomplete-theme-classic#dark-mode
        */}
        <body data-theme={isDarkTheme ? "dark" : "light"} />
      </Head>
      <HighlightSearchResults />
      <div className="dsla-search-wrapper">
        <div className="dsla-search-field" ref={autocompleteRef}></div>
        {/*<button className="dsla-search-button"></button>*/}
      </div>
    </>
  );
};

export default SearchBar;
