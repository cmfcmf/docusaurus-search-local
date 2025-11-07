# Complete Workflow Example

This shows a complete example of setting up and using the Docusaurus Search Deploy CLI.

## Project Structure

```
my-docusaurus-site/
├── docs/
├── blog/
├── src/
├── package.json
├── docusaurus.config.js
├── .env
├── .searchdeployrc.json
└── .github/
    └── workflows/
        └── deploy.yml
```

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install @cmfcmf/docusaurus-search-local
npm install --save-dev @cmfcmf/docusaurus-search-deploy
```

### 2. Configure Docusaurus Plugin

**docusaurus.config.js:**

```javascript
module.exports = {
  title: 'My Docs',
  url: 'https://docs.example.com',

  plugins: [
    [
      '@cmfcmf/docusaurus-search-local',
      {
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        language: 'en',
      },
    ],
  ],

  themeConfig: {
    // ... other config
  },
};
```

### 3. Initialize Deploy Configuration

```bash
npx docusaurus-search-deploy init
```

This creates `.searchdeployrc.json`:

```json
{
  "buildDir": "./build",
  "cloudflare": {
    "accountId": "${CLOUDFLARE_ACCOUNT_ID}",
    "apiToken": "${CLOUDFLARE_API_TOKEN}",
    "kvNamespaceId": "${CLOUDFLARE_KV_NAMESPACE_ID}",
    "workerName": "docusaurus-search-worker"
  },
  "worker": {
    "enabled": true,
    "dir": "./packages/cloudflare-worker"
  }
}
```

### 4. Set Up Cloudflare

```bash
# Login to Cloudflare
npx wrangler login

# Create KV namespace
npx wrangler kv:namespace create SEARCH_INDEXES

# Output:
# { binding = "SEARCH_INDEXES", id = "abc123def456..." }
```

### 5. Configure Environment Variables

**.env:**

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_KV_NAMESPACE_ID=abc123def456...
```

**.env.example** (for team members):

```bash
CLOUDFLARE_ACCOUNT_ID=get-from-dashboard
CLOUDFLARE_API_TOKEN=create-at-dashboard
CLOUDFLARE_KV_NAMESPACE_ID=from-wrangler-command
```

### 6. Update package.json Scripts

**package.json:**

```json
{
  "name": "my-docusaurus-site",
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "postbuild": "docusaurus-search-deploy",
    "deploy": "npm run build",
    "deploy:search-worker": "docusaurus-search-deploy worker --deploy"
  },
  "dependencies": {
    "@cmfcmf/docusaurus-search-local": "^2.0.1",
    "@docusaurus/core": "^3.0.0",
    "react": "^18.0.0"
  },
  "devDependencies": {
    "@cmfcmf/docusaurus-search-deploy": "^1.0.0"
  }
}
```

### 7. Set Up GitHub Actions

**.github/workflows/deploy.yml:**

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy search indexes
        if: github.ref == 'refs/heads/main'
        env:
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_KV_NAMESPACE_ID: ${{ secrets.CLOUDFLARE_KV_NAMESPACE_ID }}
        run: npx docusaurus-search-deploy

      - name: Deploy site to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### 8. Configure GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add these secrets:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_KV_NAMESPACE_ID`

### 9. Deploy the Cloudflare Worker (One-Time)

```bash
# Copy worker files to your project
cp -r node_modules/@cmfcmf/docusaurus-search-local-worker ./cloudflare-worker

cd cloudflare-worker

# Update wrangler.toml with your KV namespace ID
# Then deploy
npm install
npm run deploy
```

## Usage

### Local Development

```bash
# Start dev server (no deployment)
npm start

# Build locally (deploys indexes)
npm run build

# Test deployment without actually deploying
npx docusaurus-search-deploy --dry-run
```

### Production Deployment

```bash
# Commit and push
git add .
git commit -m "Update documentation"
git push origin main

# GitHub Actions automatically:
# 1. Builds the site
# 2. Deploys search indexes to Cloudflare
# 3. Deploys site to GitHub Pages
```

### Manual Deployment

```bash
# Deploy only indexes
npm run build
npx docusaurus-search-deploy

# Deploy worker
cd cloudflare-worker
npm run deploy
```

## Verification

### Test Search API

```bash
# Get your worker URL
WORKER_URL="https://docusaurus-search-worker.your-subdomain.workers.dev"

# Test search
curl -X POST $WORKER_URL/search \
  -H "Content-Type: application/json" \
  -d '{"query": "installation"}'

# Should return:
# {
#   "results": [...],
#   "total": 5,
#   "query": "installation",
#   "took": 15
# }
```

### Check Indexes in KV

```bash
# List indexes
curl $WORKER_URL/indexes

# Should return:
# {
#   "indexes": [
#     {"tag": "default", "key": "search-index-default"}
#   ]
# }
```

## Updating Documentation

When you update your docs:

```bash
# 1. Edit your docs/blog content
vim docs/getting-started.md

# 2. Commit and push
git add docs/getting-started.md
git commit -m "Update getting started guide"
git push

# 3. GitHub Actions automatically rebuilds and redeploys everything!
```

## Troubleshooting

### Build succeeds but deploy fails

Check GitHub Actions logs for error messages. Common issues:

- Invalid API token: Regenerate token with correct permissions
- Wrong KV namespace ID: Verify ID in secrets matches wrangler output
- Network timeout: GitHub Actions may need retry logic

### Search returns empty results

```bash
# Check if indexes were uploaded
npx wrangler kv:key list --namespace-id abc123def456...

# Re-upload indexes
npm run build
npx docusaurus-search-deploy
```

### Worker deployment fails

```bash
# Check wrangler configuration
cd cloudflare-worker
cat wrangler.toml

# Test locally first
npm run dev

# Deploy with verbose output
npx wrangler deploy --verbose
```

## Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **Branch Protection**: Deploy only from main/production branch
3. **Testing**: Use `--dry-run` to test before deploying
4. **Monitoring**: Check Cloudflare dashboard for request metrics
5. **Rollback**: Keep previous index versions in KV for rollback

## Cost Tracking

With typical documentation site:

- **Builds**: ~50/month (GitHub Actions: free)
- **Search requests**: ~10,000/month (Cloudflare: free tier)
- **KV storage**: ~5MB (Cloudflare: free tier)
- **Worker requests**: ~100,000/month (Cloudflare: free tier)

**Total monthly cost: $0** ✅

## Next Steps

- Set up monitoring with Cloudflare Analytics
- Add search analytics to track popular queries
- Implement search suggestions/autocomplete
- Add multi-language support
- Create custom search UI for your site
