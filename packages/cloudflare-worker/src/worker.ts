/**
 * Cloudflare Worker for Docusaurus Search Local
 *
 * This worker provides a JSON API endpoint for searching pre-built Lunr indexes.
 * Indexes are stored in Cloudflare KV and loaded on demand.
 */

import lunr from './lunr-bundle';

// Types matching the main plugin
type MyDocument = {
  id: number;
  pageTitle: string;
  sectionTitle: string;
  sectionRoute: string;
  type: "docs" | "blog" | "page";
};

type SearchIndex = {
  documents: MyDocument[];
  index: any; // Serialized Lunr index
};

type SearchRequest = {
  query: string;
  tag?: string;
  maxResults?: number;
  fields?: string[];
};

type SearchResult = {
  id: number;
  pageTitle: string;
  sectionTitle: string;
  sectionRoute: string;
  type: string;
  score: number;
};

type SearchResponse = {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
};

type Env = {
  SEARCH_INDEXES: KVNamespace;
  ALLOWED_ORIGINS?: string; // Comma-separated list of allowed origins
};

// Cache for loaded indexes (Worker instance memory)
const indexCache = new Map<string, { documents: MyDocument[]; index: lunr.Index }>();

/**
 * Load and deserialize a search index from KV storage
 */
async function loadIndex(
  kv: KVNamespace,
  tag: string
): Promise<{ documents: MyDocument[]; index: lunr.Index } | null> {
  // Check memory cache first
  const cached = indexCache.get(tag);
  if (cached) {
    return cached;
  }

  // Load from KV
  const key = `search-index-${tag}`;
  const indexData = await kv.get<SearchIndex>(key, { type: 'json' });

  if (!indexData) {
    return null;
  }

  // Deserialize the Lunr index
  const index = lunr.Index.load(indexData.index);

  // Cache in memory
  const loaded = {
    documents: indexData.documents,
    index
  };
  indexCache.set(tag, loaded);

  return loaded;
}

/**
 * Execute a search query against a loaded index
 */
function executeSearch(
  index: lunr.Index,
  documents: MyDocument[],
  query: string,
  maxResults: number = 8
): SearchResult[] {
  // Perform the search
  const results = index.search(query);

  // Map Lunr results to our document metadata
  return results
    .slice(0, maxResults)
    .map(result => {
      const doc = documents.find(d => d.id === parseInt(result.ref));
      if (!doc) {
        return null;
      }
      return {
        ...doc,
        score: result.score
      };
    })
    .filter((r): r is SearchResult => r !== null);
}

/**
 * CORS headers helper
 */
function getCorsHeaders(request: Request, allowedOrigins?: string): HeadersInit {
  const origin = request.headers.get('Origin');

  // If no allowed origins specified, allow all
  if (!allowedOrigins) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  }

  // Check if origin is in allowed list
  const allowed = allowedOrigins.split(',').map(o => o.trim());
  if (origin && allowed.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
  }

  // Default: no CORS
  return {};
}

/**
 * Handle OPTIONS preflight requests
 */
function handleOptions(request: Request, env: Env): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, env.ALLOWED_ORIGINS),
  });
}

/**
 * Handle search requests
 */
async function handleSearch(request: Request, env: Env): Promise<Response> {
  const startTime = Date.now();

  try {
    let searchRequest: SearchRequest;

    // Parse request (support both GET and POST)
    if (request.method === 'GET') {
      const url = new URL(request.url);
      searchRequest = {
        query: url.searchParams.get('q') || url.searchParams.get('query') || '',
        tag: url.searchParams.get('tag') || 'default',
        maxResults: parseInt(url.searchParams.get('maxResults') || '8'),
      };
    } else if (request.method === 'POST') {
      searchRequest = await request.json<SearchRequest>();
      searchRequest.tag = searchRequest.tag || 'default';
      searchRequest.maxResults = searchRequest.maxResults || 8;
    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
        },
      });
    }

    // Validate query
    if (!searchRequest.query || searchRequest.query.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Query parameter is required',
          results: [],
          total: 0,
          query: '',
          took: 0
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
          },
        }
      );
    }

    // Load the index
    const loaded = await loadIndex(env.SEARCH_INDEXES, searchRequest.tag);

    if (!loaded) {
      return new Response(
        JSON.stringify({
          error: `Index not found for tag: ${searchRequest.tag}`,
          availableTags: 'Use the /indexes endpoint to see available indexes'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
          },
        }
      );
    }

    // Execute search
    const results = executeSearch(
      loaded.index,
      loaded.documents,
      searchRequest.query,
      searchRequest.maxResults
    );

    const took = Date.now() - startTime;

    const response: SearchResponse = {
      results,
      total: results.length,
      query: searchRequest.query,
      took,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
      },
    });

  } catch (error) {
    const took = Date.now() - startTime;
    console.error('Search error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        took
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
        },
      }
    );
  }
}

/**
 * Handle requests to list available indexes
 */
async function handleListIndexes(request: Request, env: Env): Promise<Response> {
  try {
    // List all keys in KV (limited to search-index-* pattern)
    const list = await env.SEARCH_INDEXES.list({ prefix: 'search-index-' });

    const indexes = list.keys.map(key => ({
      tag: key.name.replace('search-index-', ''),
      key: key.name,
      // @ts-ignore - metadata exists but types may not include it
      metadata: key.metadata
    }));

    return new Response(JSON.stringify({ indexes }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
      },
    });

  } catch (error) {
    console.error('List indexes error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to list indexes',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
        },
      }
    );
  }
}

/**
 * Main request handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request, env);
    }

    // Route to appropriate handler
    if (url.pathname === '/search' || url.pathname === '/api/search') {
      return handleSearch(request, env);
    }

    if (url.pathname === '/indexes' || url.pathname === '/api/indexes') {
      return handleListIndexes(request, env);
    }

    // Root endpoint - return API documentation
    if (url.pathname === '/' || url.pathname === '/api') {
      return new Response(
        JSON.stringify({
          name: 'Docusaurus Search Local API',
          version: '1.0.0',
          endpoints: {
            'POST /search': 'Search the documentation',
            'GET /search?q=query&tag=default&maxResults=8': 'Search the documentation (GET)',
            'GET /indexes': 'List available search indexes'
          },
          usage: {
            search: {
              method: 'POST',
              url: '/search',
              body: {
                query: 'string (required)',
                tag: 'string (optional, default: "default")',
                maxResults: 'number (optional, default: 8)'
              }
            }
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
          },
        }
      );
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(request, env.ALLOWED_ORIGINS),
        },
      }
    );
  },
};
