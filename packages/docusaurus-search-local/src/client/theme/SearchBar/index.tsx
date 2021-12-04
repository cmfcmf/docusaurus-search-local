import React, { useRef, useEffect, createElement, Fragment } from "react";
import { render } from "react-dom";
import { autocomplete, AutocompleteApi } from "@algolia/autocomplete-js";
import type lunr from "lunr";
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  useActivePluginAndVersion,
  useAllDocsData,
} from "@theme/hooks/useDocs";
import {
  docVersionSearchTag,
  DEFAULT_SEARCH_TAG,
  useDocsPreferredVersionByPluginId,
} from "@docusaurus/theme-common";
import useThemeContext from "@theme/hooks/useThemeContext";
import { mylunr, tokenize } from "./generatedWrapper";
import {
  DSLALocationState,
  HighlightSearchResults,
} from "./HighlightSearchResults";
import { usePluginData } from "@docusaurus/useGlobalData";
import type { DSLAPluginData, MyDocument } from "../../../types";

const SEARCH_INDEX_AVAILABLE = process.env.NODE_ENV === "production";

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
        allTags: json.allTags as string[],
        index: mylunr.Index.load(json.index),
      }));
  } else {
    // The index does not exist in development, therefore load a dummy index here.
    return Promise.resolve({
      documents: [],
      allTags: [DEFAULT_SEARCH_TAG],
      index: mylunr(function () {
        this.ref("id");
        this.field("title");
        this.field("content");
      }),
    });
  }
}

// Copied from Docusaurus, will be available from @docusaurus/theme-common from beta10 onwards.
// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-common/src/utils/useContextualSearchFilters.ts
function useContextualSearchFilters() {
  const { i18n } = useDocusaurusContext();
  const allDocsData = useAllDocsData();
  const activePluginAndVersion = useActivePluginAndVersion();
  const docsPreferredVersionByPluginId = useDocsPreferredVersionByPluginId();

  function getDocPluginTags(pluginId: string) {
    const activeVersion =
      activePluginAndVersion?.activePlugin?.pluginId === pluginId
        ? activePluginAndVersion.activeVersion
        : undefined;

    const preferredVersion = docsPreferredVersionByPluginId[pluginId];

    const latestVersion = allDocsData[pluginId].versions.find((v) => v.isLast)!;

    const version = activeVersion ?? preferredVersion ?? latestVersion;

    return docVersionSearchTag(pluginId, version.name);
  }

  const tags = [
    DEFAULT_SEARCH_TAG,
    ...Object.keys(allDocsData).map(getDocPluginTags),
  ];

  return {
    locale: i18n.currentLocale,
    tags,
  };
}

const SearchBar = () => {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const {
    titleBoost,
    contentBoost,
    parentCategoriesBoost,
    indexDocSidebarParentCategories,
  } = usePluginData<DSLAPluginData>("@cmfcmf/docusaurus-search-local");

  const history = useHistory<DSLALocationState>();

  const { tags } = useContextualSearchFilters();
  const tagsRef = useRef(tags);
  useEffect(() => {
    tagsRef.current = tags;
  }, [tags]);

  const index = useRef<
    | null
    | "loading"
    | {
        documents: MyDocument[];
        allTags: string[];
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

  const placeholder = translate({
    message: "cmfcmf/d-s-l.searchBar.placeholder",
    description: "Placeholder shown in the searchbar",
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
          history.push(itemUrl, {
            cmfcmfhighlight: {
              terms: item.terms,
              isDocsOrBlog:
                item.document.type === "docs" || item.document.type === "blog",
            },
          });
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
                // if (versionToSearchRef.current && document.docVersion !== undefined) {
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
                      history.push(url, {
                        cmfcmfhighlight: {
                          terms: item.terms,
                          isDocsOrBlog:
                            item.document.type === "docs" ||
                            item.document.type === "blog",
                        },
                      });
                    }}
                  >
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">
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
                    <div className="aa-ItemContentBody">
                      {SEARCH_INDEX_AVAILABLE
                        ? translate({
                            message: "cmfcmf/d-s-l.searchBar.noResults",
                            description:
                              "message shown if no results are found",
                          })
                        : // No need to translate this message, since its only shown in development.
                          "The search index is only available when you run docusaurus build!"}
                    </div>
                  </div>
                );
              },
            },
            getItemUrl({ item }) {
              return getItemUrl(item);
            },
            async getItems() {
              const { documents, allTags, index } = await getIndex();
              const terms = tokenize(input);
              const results = index
                .query((query) => {
                  query.term(terms, { fields: ["title"], boost: titleBoost });
                  query.term(terms, {
                    fields: ["title"],
                    boost: titleBoost,
                    wildcard: mylunr.Query.wildcard.TRAILING,
                  });
                  query.term(terms, {
                    fields: ["content"],
                    boost: contentBoost,
                  });
                  query.term(terms, {
                    fields: ["content"],
                    boost: contentBoost,
                    wildcard: mylunr.Query.wildcard.TRAILING,
                  });

                  if (indexDocSidebarParentCategories) {
                    query.term(terms, {
                      fields: ["sidebarParentCategories"],
                      boost: parentCategoriesBoost,
                    });
                    query.term(terms, {
                      fields: ["sidebarParentCategories"],
                      boost: parentCategoriesBoost,
                      wildcard: mylunr.Query.wildcard.TRAILING,
                    });
                  }

                  // We want to search all documents with whose tag is included in `searchTags`.
                  // Since lunr.js does not allow OR queries, we instead prohibit all other tags.
                  //
                  // https://github.com/cmfcmf/docusaurus-search-local/issues/19
                  const searchTags = tagsRef.current;
                  allTags.forEach((tag) => {
                    if (!searchTags.includes(tag)) {
                      query.term(tag, {
                        fields: ["tag"],
                        boost: 0,
                        presence: mylunr.Query.presence.PROHIBITED,
                        // Disable stemmer for tags.
                        usePipeline: false,
                      });
                    }
                  });
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

  const { isDarkTheme } = useThemeContext();

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
        <div
          className="dsla-search-field"
          ref={autocompleteRef}
          data-tags={tags.join(",")}
        />
        {/*<button className="dsla-search-button"></button>*/}
      </div>
    </>
  );
};

export default SearchBar;
