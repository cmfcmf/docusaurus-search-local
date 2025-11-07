/**
 * Example: Integrating Cloudflare Worker API with Docusaurus Search
 *
 * This file shows different ways to integrate the worker API into your
 * Docusaurus site.
 */

// ============================================================================
// Example 1: Simple fetch wrapper
// ============================================================================

const WORKER_URL = 'https://docusaurus-search-worker.your-subdomain.workers.dev';

async function searchDocs(query, options = {}) {
  const response = await fetch(`${WORKER_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      tag: options.tag || 'default',
      maxResults: options.maxResults || 8,
    })
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

// Usage:
// const results = await searchDocs('installation');
// console.log(results.results);

// ============================================================================
// Example 2: React Hook for Docusaurus
// ============================================================================

import { useState, useEffect } from 'react';

function useDocSearch(query, enabled = true) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    let timeoutId;

    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${WORKER_URL}/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, maxResults: 10 }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce search by 300ms
    timeoutId = setTimeout(performSearch, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, enabled]);

  return { results, loading, error };
}

// Usage in a React component:
// function SearchComponent() {
//   const [query, setQuery] = useState('');
//   const { results, loading, error } = useDocSearch(query);
//
//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search docs..."
//       />
//       {loading && <p>Searching...</p>}
//       {error && <p>Error: {error}</p>}
//       <ul>
//         {results.map((result) => (
//           <li key={result.id}>
//             <a href={result.sectionRoute}>{result.sectionTitle}</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// ============================================================================
// Example 3: Autocomplete Integration (Algolia Autocomplete)
// ============================================================================

import { autocomplete } from '@algolia/autocomplete-js';

function initWorkerAutocomplete(container) {
  autocomplete({
    container,
    placeholder: 'Search documentation...',
    openOnFocus: true,
    getSources({ query }) {
      if (!query) {
        return [];
      }

      return [
        {
          sourceId: 'docs',
          async getItems() {
            const response = await fetch(`${WORKER_URL}/search`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query, maxResults: 8 }),
            });

            const data = await response.json();
            return data.results;
          },
          templates: {
            item({ item }) {
              return `
                <div class="aa-ItemContent">
                  <div class="aa-ItemTitle">${item.sectionTitle}</div>
                  <div class="aa-ItemDescription">${item.pageTitle}</div>
                </div>
              `;
            },
          },
          getItemUrl({ item }) {
            return item.sectionRoute;
          },
        },
      ];
    },
  });
}

// Usage:
// initWorkerAutocomplete('#search-container');

// ============================================================================
// Example 4: Swizzled SearchBar Component (Docusaurus)
// ============================================================================

// First, swizzle the component:
// npm run swizzle @cmfcmf/docusaurus-search-local SearchBar -- --eject

// Then modify the swizzled component to use the worker:

import React, { useState, useEffect, useCallback } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`${WORKER_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      setResults(data.results);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Search..."
        className="search-input"
      />
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map((result) => (
            <a
              key={result.id}
              href={result.sectionRoute}
              className="search-result-item"
              onClick={() => setIsOpen(false)}
            >
              <div className="search-result-title">{result.sectionTitle}</div>
              {result.pageTitle !== result.sectionTitle && (
                <div className="search-result-page">{result.pageTitle}</div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 5: Versioned Documentation Search
// ============================================================================

async function searchVersionedDocs(query, version = 'current') {
  // Map Docusaurus version to index tag
  const tagMap = {
    'current': 'default',
    'v2.0': 'docs-default-v2.0',
    'v1.0': 'docs-default-v1.0',
  };

  const tag = tagMap[version] || 'default';

  const response = await fetch(`${WORKER_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      tag,
      maxResults: 10,
    }),
  });

  return response.json();
}

// Usage:
// const results = await searchVersionedDocs('API', 'v2.0');

// ============================================================================
// Example 6: Search with Error Handling and Retry
// ============================================================================

async function robustSearch(query, options = {}) {
  const maxRetries = 3;
  const retryDelay = 1000; // ms

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`${WORKER_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          tag: options.tag || 'default',
          maxResults: options.maxResults || 8,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;

      if (isLastAttempt) {
        console.error('Search failed after retries:', error);
        return {
          results: [],
          total: 0,
          query,
          error: 'Search service temporarily unavailable',
        };
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }
}

// Usage:
// const results = await robustSearch('installation');

// ============================================================================
// Example 7: Analytics Integration
// ============================================================================

async function searchWithAnalytics(query, options = {}) {
  const startTime = performance.now();

  try {
    const data = await searchDocs(query, options);
    const endTime = performance.now();

    // Send analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        results_count: data.total,
        response_time: endTime - startTime,
      });
    }

    // Or use your analytics service
    // analytics.track('Search', {
    //   query,
    //   resultsCount: data.total,
    //   responseTime: endTime - startTime,
    // });

    return data;
  } catch (error) {
    // Track search errors
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `Search error: ${error.message}`,
        fatal: false,
      });
    }

    throw error;
  }
}

// ============================================================================
// Example 8: GET Request (for simple use cases)
// ============================================================================

async function simpleSearch(query) {
  const params = new URLSearchParams({
    q: query,
    maxResults: '10',
  });

  const response = await fetch(`${WORKER_URL}/search?${params}`);
  return response.json();
}

// Can be used directly in browser:
// <a href="https://your-worker.workers.dev/search?q=installation" target="_blank">
//   Search for installation
// </a>
