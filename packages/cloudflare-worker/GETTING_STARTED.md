# Getting Started with Docusaurus Search Worker

## Overview

This Cloudflare Worker converts your existing Docusaurus Search Local plugin into a JSON API, allowing you to serve search results from Cloudflare's edge network instead of loading indexes in the browser.

## What You'll Need (5 minutes setup)

1. A Cloudflare account (free tier works!)
2. Your Docusaurus site with search indexes built
3. Node.js installed locally

## Installation Steps

### Step 1: Install Dependencies (1 min)

```bash
cd packages/cloudflare-worker
npm install
```

### Step 2: Set Up Cloudflare (2 min)

```bash
# Login to Cloudflare
npx wrangler login

# Create KV namespace for storing indexes
npx wrangler kv:namespace create SEARCH_INDEXES
npx wrangler kv:namespace create SEARCH_INDEXES --preview
```

Copy the IDs shown and update `wrangler.toml`.

### Step 3: Upload Your Indexes (1 min)

```bash
# Set your Cloudflare credentials
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_API_TOKEN="your-api-token"  
export CLOUDFLARE_KV_NAMESPACE_ID="from-step-2"

# Upload indexes
npm run upload-indexes /path/to/your/docusaurus/build
```

### Step 4: Deploy (1 min)

```bash
npm run deploy
```

Done! Your search API is now live at:
```
https://docusaurus-search-worker.your-subdomain.workers.dev
```

## Test It

```bash
curl -X POST https://your-worker.workers.dev/search \
  -H "Content-Type: application/json" \
  -d '{"query": "installation"}'
```

## Use It in Your Site

```javascript
// In your Docusaurus site
async function search(query) {
  const res = await fetch('https://your-worker.workers.dev/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return res.json();
}

const results = await search('getting started');
console.log(results.results);
```

## What's Next?

- See **README.md** for full feature documentation
- See **DEPLOYMENT.md** for detailed deployment guide
- See **examples/client-integration.js** for integration examples
- See **SUMMARY.md** for architecture overview

## Troubleshooting

**"Namespace not found"**
→ Update `wrangler.toml` with your KV namespace ID

**"No indexes found"**
→ Make sure you ran `npm run upload-indexes`

**CORS errors**
→ Add your domain to `ALLOWED_ORIGINS` in `wrangler.toml`

## Need Help?

Check out the full documentation in README.md and DEPLOYMENT.md!
