# Docusaurus Search Local - Cloudflare Worker

A lightweight Cloudflare Worker that provides a JSON API endpoint for searching Docusaurus documentation using pre-built Lunr indexes.

## Features

- 🚀 **Fast**: Runs on Cloudflare's edge network for low latency worldwide
- 💰 **Cost-effective**: Serverless with generous free tier
- 🔍 **Powerful**: Uses Lunr.js full-text search with BM25 ranking
- 🌐 **CORS-ready**: Configurable CORS support for client-side requests
- 📦 **Simple deployment**: One command to deploy
- 🔄 **Auto-caching**: In-memory index caching for fast responses

## Prerequisites

1. [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
2. [Node.js](https://nodejs.org/) 18+ and npm
3. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare's CLI tool)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create KV Namespace

Create a KV namespace to store your search indexes:

```bash
# Create production namespace
wrangler kv:namespace create SEARCH_INDEXES

# Create preview namespace for development
wrangler kv:namespace create SEARCH_INDEXES --preview
```

This will output namespace IDs like:
```
{ binding = "SEARCH_INDEXES", id = "abc123..." }
```

### 3. Configure Wrangler

Edit `wrangler.toml` and replace the placeholder KV namespace IDs with your actual IDs:

```toml
[[kv_namespaces]]
binding = "SEARCH_INDEXES"
id = "abc123..."  # Replace with your KV namespace ID from step 2
```

### 4. Build Your Docusaurus Site

Build your Docusaurus site to generate search indexes:

```bash
cd /path/to/your/docusaurus/site
npm run build
```

This creates `search-index-*.json` files in your `build/` directory.

### 5. Upload Indexes to KV

Upload the generated indexes to Cloudflare KV:

```bash
# Set your Cloudflare credentials
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_API_TOKEN="your-api-token"
export CLOUDFLARE_KV_NAMESPACE_ID="your-kv-namespace-id"

# Upload indexes
npm run upload-indexes /path/to/your/docusaurus/site/build
```

**Getting your credentials:**
- **Account ID**: Found in Cloudflare Dashboard → Workers & Pages → Overview
- **API Token**: Create at Cloudflare Dashboard → My Profile → API Tokens
  - Use "Edit Cloudflare Workers" template
  - Or create custom token with "Workers KV Storage:Edit" permission

### 6. Deploy the Worker

```bash
npm run deploy
```

Your worker is now live! You'll see a URL like:
```
https://docusaurus-search-worker.your-subdomain.workers.dev
```

## API Documentation

### Search Endpoint

**POST /search** or **GET /search**

Search the documentation and return results.

**Request (POST):**
```json
{
  "query": "getting started",
  "tag": "default",
  "maxResults": 8
}
```

**Request (GET):**
```
GET /search?q=getting+started&tag=default&maxResults=8
```

**Parameters:**
- `query` (required): Search query string
- `tag` (optional): Index tag/version to search (default: "default")
- `maxResults` (optional): Maximum number of results to return (default: 8)

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "pageTitle": "Getting Started",
      "sectionTitle": "Introduction",
      "sectionRoute": "/docs/intro#introduction",
      "type": "docs",
      "score": 2.534
    }
  ],
  "total": 1,
  "query": "getting started",
  "took": 12
}
```

### List Indexes Endpoint

**GET /indexes**

List all available search indexes.

**Response:**
```json
{
  "indexes": [
    {
      "tag": "default",
      "key": "search-index-default",
      "metadata": {}
    }
  ]
}
```

### Root Endpoint

**GET /**

Returns API documentation.

## Development

### Local Development

Run the worker locally with Wrangler:

```bash
npm run dev
```

This starts a local server at `http://localhost:8787`.

**Note:** You'll need to upload indexes to your preview KV namespace first:

```bash
npm run upload-indexes /path/to/build -- --preview
```

### Testing

Test the deployed worker:

```bash
# Test search
curl -X POST https://your-worker.workers.dev/search \
  -H "Content-Type: application/json" \
  -d '{"query": "installation"}'

# Test with GET
curl "https://your-worker.workers.dev/search?q=installation&maxResults=5"

# List indexes
curl https://your-worker.workers.dev/indexes
```

## Configuration

### CORS Configuration

By default, the worker allows requests from any origin (`Access-Control-Allow-Origin: *`). To restrict to specific domains, add to `wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
```

### Multiple Environments

The `wrangler.toml` supports multiple environments:

```bash
# Deploy to production
npm run deploy:production

# Deploy to staging
wrangler deploy --env staging
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Deploy Search Worker

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - 'build/search-index-*.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Upload indexes to KV
        env:
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_KV_NAMESPACE_ID: ${{ secrets.CLOUDFLARE_KV_NAMESPACE_ID }}
        run: |
          cd packages/cloudflare-worker
          npm install
          npm run upload-indexes ../../build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: packages/cloudflare-worker
```

## Client Integration

### Fetch API Example

```javascript
async function searchDocs(query) {
  const response = await fetch('https://your-worker.workers.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      maxResults: 10
    })
  });

  const data = await response.json();
  return data.results;
}

// Usage
const results = await searchDocs('installation');
console.log(results);
```

### Modify Docusaurus SearchBar

To use the worker API instead of client-side search, you can swizzle the SearchBar component:

```bash
npm run swizzle @cmfcmf/docusaurus-search-local SearchBar
```

Then modify the component to call your worker endpoint instead of loading local indexes.

## Troubleshooting

### "Index not found" error

Make sure you've uploaded the indexes:
```bash
npm run upload-indexes /path/to/build
```

### KV namespace binding error

Verify your `wrangler.toml` has the correct KV namespace ID:
```bash
wrangler kv:namespace list
```

### Large index files

KV has a 25MB limit per value. If your index exceeds this:
1. Split your documentation into multiple versions/tags
2. Each tag gets its own index file
3. Consider using Cloudflare R2 instead of KV for very large indexes

### CORS errors

Add your domain to `ALLOWED_ORIGINS` in `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "https://yourdomain.com"
```

## Limitations

- **KV Storage**: 1GB free, 1MB max value size (25MB with paid plan)
- **Worker CPU Time**: 10ms free tier, 50ms paid tier (usually sufficient)
- **Requests**: 100,000/day free, unlimited on paid ($5/month)
- **Index Size**: Keep indexes under 25MB for best performance

## Performance Tips

1. **Enable caching**: Worker automatically caches loaded indexes in memory
2. **Use versioned indexes**: Split large documentation sets by version
3. **Optimize index size**: Limit `maxSearchResults` in plugin options
4. **CDN benefits**: Cloudflare serves from 200+ locations worldwide

## Cost Estimate

**Free tier** (typical small docs site):
- Worker requests: 100,000/day (free)
- KV storage: 1GB (free)
- KV reads: 100,000/day (free)

**Paid plan** ($5/month minimum):
- Worker requests: Unlimited
- KV storage: First 1GB free, $0.50/GB after
- KV reads: First 10M/month free

For most documentation sites, the **free tier is sufficient**.

## Architecture

```
Client Request
     ↓
Cloudflare Edge (Worker)
     ↓
Load Index from KV (cached)
     ↓
Lunr.js Search
     ↓
JSON Response
```

**Benefits:**
- No server to manage
- Instant global deployment
- Automatic scaling
- Built-in DDoS protection
- ~50ms response time worldwide

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT

## Related Projects

- [Docusaurus Search Local](https://github.com/cmfcmf/docusaurus-search-local) - The main plugin
- [Lunr.js](https://lunrjs.com/) - Search engine library
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
