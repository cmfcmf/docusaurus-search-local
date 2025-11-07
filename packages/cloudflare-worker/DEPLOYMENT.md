# Deployment Guide

This guide covers deploying the Docusaurus Search Worker to Cloudflare.

## Prerequisites Checklist

- [ ] Cloudflare account created
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Authenticated with Cloudflare (`wrangler login`)
- [ ] Docusaurus site built with search indexes

## Step-by-Step Deployment

### 1. Set Up Cloudflare KV

```bash
# Navigate to worker directory
cd packages/cloudflare-worker

# Create production KV namespace
wrangler kv:namespace create SEARCH_INDEXES

# Create preview KV namespace (for local development)
wrangler kv:namespace create SEARCH_INDEXES --preview
```

**Expected Output:**
```
🌀 Creating namespace with title "docusaurus-search-worker-SEARCH_INDEXES"
✨ Success!
Add the following to your wrangler.toml:
{ binding = "SEARCH_INDEXES", id = "abc123def456..." }

🌀 Creating namespace with title "docusaurus-search-worker-SEARCH_INDEXES_preview"
✨ Success!
Add the following to your wrangler.toml:
{ binding = "SEARCH_INDEXES", preview_id = "xyz789uvw012..." }
```

### 2. Update wrangler.toml

Edit `wrangler.toml` and add the namespace IDs from step 1:

```toml
[[kv_namespaces]]
binding = "SEARCH_INDEXES"
id = "abc123def456..."              # Production ID from step 1
preview_id = "xyz789uvw012..."       # Preview ID from step 1
```

### 3. Get Cloudflare Credentials

You need three pieces of information:

#### Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click "Workers & Pages" in sidebar
3. Copy your Account ID from the right sidebar

#### API Token
1. Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Click "Continue to summary" → "Create Token"
5. **Save the token** (you won't see it again!)

#### KV Namespace ID
- Use the `id` value from step 1

### 4. Upload Search Indexes

```bash
# Set environment variables (or add to ~/.bashrc / ~/.zshrc)
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_API_TOKEN="your-api-token"
export CLOUDFLARE_KV_NAMESPACE_ID="abc123def456..."

# Navigate to your Docusaurus build directory
# (adjust path based on your setup)
cd /path/to/your/docusaurus/site

# Build your site to generate fresh indexes
npm run build

# Go back to worker directory
cd /path/to/docusaurus-search-local/packages/cloudflare-worker

# Install dependencies
npm install

# Upload indexes to KV
npm run upload-indexes /path/to/your/docusaurus/site/build
```

**Expected Output:**
```
Docusaurus Search Local - Index Upload
======================================

Build directory: /path/to/build
KV Namespace ID: abc123def456...
Account ID: your-account-id
Mode: Production

Found 1 index file(s):

  search-index-default.json
    Tag: default
    Size: 245.67 KB
    KV Key: search-index-default.json

Uploading to Cloudflare KV...

Uploading search-index-default.json...
  ✓ Success

Upload complete!
  Successful: 1
  Failed: 0
```

### 5. Deploy the Worker

```bash
# Deploy to Cloudflare
npm run deploy
```

**Expected Output:**
```
⛅️ wrangler 3.90.0
-------------------
Total Upload: 145.23 KiB / gzip: 42.11 KiB
Uploaded docusaurus-search-worker (1.23 sec)
Published docusaurus-search-worker (0.31 sec)
  https://docusaurus-search-worker.your-subdomain.workers.dev
```

**🎉 Your worker is now live!**

### 6. Test the Deployment

```bash
# Save your worker URL
WORKER_URL="https://docusaurus-search-worker.your-subdomain.workers.dev"

# Test API info endpoint
curl $WORKER_URL/

# Test search
curl -X POST $WORKER_URL/search \
  -H "Content-Type: application/json" \
  -d '{"query": "getting started"}'

# Test with GET
curl "$WORKER_URL/search?q=installation&maxResults=5"

# List available indexes
curl $WORKER_URL/indexes
```

## Environment-Specific Deployments

### Development Environment

```bash
# Deploy to development environment
wrangler deploy --env development

# Use development KV namespace
export CLOUDFLARE_KV_NAMESPACE_ID="xyz789uvw012..."  # Preview namespace ID
npm run upload-indexes /path/to/build -- --preview
```

### Production Environment

```bash
# Deploy to production
wrangler deploy --env production
# or
npm run deploy:production
```

## Updating Indexes

When you update your documentation:

```bash
# 1. Rebuild Docusaurus site
cd /path/to/your/docusaurus/site
npm run build

# 2. Upload new indexes
cd /path/to/docusaurus-search-local/packages/cloudflare-worker
npm run upload-indexes /path/to/your/docusaurus/site/build

# Worker automatically picks up new indexes (no redeployment needed!)
```

## Custom Domain

To use a custom domain like `search.yourdomain.com`:

### Option 1: Workers Route (Recommended)

1. Go to Cloudflare Dashboard → Workers & Pages
2. Click your worker
3. Go to "Settings" → "Triggers"
4. Click "Add route"
5. Enter: `search.yourdomain.com/*`
6. Select your zone (yourdomain.com)
7. Click "Add route"

### Option 2: Custom Domain

1. Go to Cloudflare Dashboard → Workers & Pages
2. Click your worker
3. Go to "Settings" → "Domains & Routes"
4. Click "Add" under "Custom Domains"
5. Enter: `search.yourdomain.com`
6. Click "Add Custom Domain"

**Update CORS:**
```toml
# wrangler.toml
[vars]
ALLOWED_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
```

Redeploy:
```bash
npm run deploy
```

## Monitoring

### View Logs

```bash
# Tail live logs
wrangler tail

# Filter by status
wrangler tail --status error
```

### Analytics

1. Go to Cloudflare Dashboard → Workers & Pages
2. Click your worker
3. View metrics:
   - Requests per second
   - Error rate
   - CPU time
   - Success rate

## Rollback

If you need to rollback to a previous deployment:

```bash
# List deployments
wrangler deployments list

# Rollback to specific deployment
wrangler rollback [deployment-id]
```

## Troubleshooting

### "Namespace not found" error

**Problem:** Worker can't find KV namespace.

**Solution:**
1. Verify namespace ID in `wrangler.toml`
2. Run `wrangler kv:namespace list` to check
3. Make sure binding name is `SEARCH_INDEXES`

### "Authentication error" when uploading

**Problem:** Invalid API token or account ID.

**Solution:**
1. Regenerate API token with "Workers KV Storage:Edit" permission
2. Verify account ID from dashboard
3. Make sure environment variables are set

### Worker returns 404 for all searches

**Problem:** Indexes not uploaded to KV.

**Solution:**
```bash
# Verify indexes exist in KV
wrangler kv:key list --binding SEARCH_INDEXES --preview false

# Re-upload if needed
npm run upload-indexes /path/to/build
```

### CORS errors in browser

**Problem:** Origin not allowed.

**Solution:**
Add your domain to `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "https://yourdomain.com"
```
Then redeploy:
```bash
npm run deploy
```

### Worker exceeds CPU time limit

**Problem:** Large indexes cause timeout.

**Solution:**
1. Reduce index size by limiting content
2. Split into multiple version-specific indexes
3. Upgrade to paid Workers plan (50ms CPU time)

## Production Checklist

- [ ] Custom domain configured
- [ ] CORS properly configured for your domain(s)
- [ ] Indexes uploaded and tested
- [ ] Monitoring/alerts set up (optional)
- [ ] API documented for your team
- [ ] Client code updated to use worker URL
- [ ] Tested search functionality end-to-end
- [ ] CI/CD pipeline configured (optional)

## Next Steps

1. **Set up CI/CD**: Automate index uploads and deployments
2. **Monitor usage**: Check Cloudflare analytics regularly
3. **Optimize indexes**: Remove unnecessary content to reduce size
4. **Add features**: Consider adding search analytics, autocomplete suggestions, etc.

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Community](https://community.cloudflare.com/)
