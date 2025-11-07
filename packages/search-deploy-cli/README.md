# Search Deploy CLI

A CLI tool to deploy Lunr.js search indexes to Cloudflare Workers KV as part of your build process.

Works with any static site that generates Lunr search indexes (Docusaurus, Jekyll, Hugo with search plugins, etc.).

## Installation

```bash
npm install --save-dev @cmfcmf/docusaurus-search-deploy
```

Or use directly with npx:

```bash
npx @cmfcmf/docusaurus-search-deploy
```

## Quick Start

### 1. Initialize

```bash
npx search-deploy init
```

This creates a `.searchdeployrc.json` config file and `.env.example`.

### 2. Configure

Set environment variables:

```bash
# .env
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_KV_NAMESPACE_ID=your-kv-namespace-id
```

### 3. Add to Build Process

```json
{
  "scripts": {
    "build": "your-build-command",
    "postbuild": "search-deploy"
  }
}
```

### 4. Deploy

```bash
npm run build
# Automatically deploys after build completes!
```

## Usage

### Deploy Command

```bash
# Deploy with default config (looks for search-index-*.json in ./build)
search-deploy

# Deploy with custom config
search-deploy --config ./my-config.json

# Deploy with custom build directory
search-deploy --dir ./dist

# Dry run (show what would be deployed)
search-deploy --dry-run

# Deploy indexes AND worker
search-deploy --worker
```

### Worker Commands

```bash
# Deploy the Cloudflare Worker
search-deploy worker --deploy

# View worker logs
search-deploy worker --logs
```

### Init Command

```bash
# Interactive setup
search-deploy init

# With custom worker directory
search-deploy init --worker-dir ./custom/path
```

## Requirements

The CLI expects search index files in this format:

**Filename:** `search-index-{tag}.json` (e.g., `search-index-default.json`)

**Content:**
```json
{
  "documents": [
    {
      "id": 1,
      "pageTitle": "Getting Started",
      "sectionTitle": "Introduction",
      "sectionRoute": "/docs/intro#introduction",
      "type": "docs"
    }
  ],
  "index": {
    // Serialized Lunr.js index
  }
}
```

This format is used by:
- @cmfcmf/docusaurus-search-local
- Other Lunr-based search implementations

## Configuration

### Config File Locations

The CLI looks for configuration in these locations (in order):

1. `.searchdeployrc`
2. `.searchdeployrc.json`
3. `.searchdeployrc.js`
4. `searchdeploy.config.js`
5. `searchdeploy` key in `package.json`

### Config File Format

**.searchdeployrc.json:**

```json
{
  "buildDir": "./build",
  "cloudflare": {
    "accountId": "${CLOUDFLARE_ACCOUNT_ID}",
    "apiToken": "${CLOUDFLARE_API_TOKEN}",
    "kvNamespaceId": "${CLOUDFLARE_KV_NAMESPACE_ID}",
    "workerName": "search-worker"
  },
  "worker": {
    "enabled": true,
    "dir": "./cloudflare-worker"
  }
}
```

**searchdeploy.config.js:**

```javascript
module.exports = {
  buildDir: './build',
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    kvNamespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
    workerName: 'search-worker',
  },
  worker: {
    enabled: true,
    dir: './cloudflare-worker',
  },
};
```

**package.json:**

```json
{
  "searchdeploy": {
    "buildDir": "./build",
    "cloudflare": {
      "accountId": "${CLOUDFLARE_ACCOUNT_ID}",
      "apiToken": "${CLOUDFLARE_API_TOKEN}",
      "kvNamespaceId": "${CLOUDFLARE_KV_NAMESPACE_ID}"
    }
  }
}
```

## Integration Examples

### With npm/yarn scripts

```json
{
  "scripts": {
    "build": "your-site-generator build",
    "postbuild": "search-deploy",
    "deploy": "npm run build"
  }
}
```

### With GitHub Actions

```yaml
name: Deploy Site

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy search indexes
        env:
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_KV_NAMESPACE_ID: ${{ secrets.CLOUDFLARE_KV_NAMESPACE_ID }}
        run: npx search-deploy
```

### Programmatic Usage

```javascript
const { deploy, loadConfig } = require('@cmfcmf/docusaurus-search-deploy');

async function deployIndexes() {
  const config = await loadConfig();
  await deploy(config, { dryRun: false });
}

deployIndexes();
```

## Environment Variables

All configuration can be set via environment variables:

```bash
CLOUDFLARE_ACCOUNT_ID=abc123
CLOUDFLARE_API_TOKEN=your-token
CLOUDFLARE_KV_NAMESPACE_ID=xyz789
```

## Auto-Detection

The CLI automatically detects:

- **Build directory**: Looks for `build/`, `dist/`, or any directory with `search-index-*.json` files
- **Index files**: Finds all `search-index-*.json` files
- **Config file**: Searches standard config file locations

## Output

```bash
🚀 Search Index Deploy

✓ Found 2 index file(s)

  📄 search-index-default.json
     Tag: default
     Size: 245.67 KB

  📄 search-index-v2.json
     Tag: v2
     Size: 180.34 KB

⠋ Uploading to Cloudflare KV...
✓ Uploaded 2 index file(s) to Cloudflare KV

✅ Deployment complete!
```

## Cloudflare Setup

### 1. Create KV Namespace

```bash
npx wrangler kv:namespace create SEARCH_INDEXES
```

Copy the namespace ID from the output.

### 2. Get Credentials

- **Account ID**: Cloudflare Dashboard → Workers & Pages → Overview
- **API Token**: Cloudflare Dashboard → My Profile → API Tokens
  - Use "Edit Cloudflare Workers" template
  - Or create custom token with "Workers KV Storage:Edit" permission

### 3. Deploy Worker (Optional)

If you want the search API endpoint:

```bash
# Get the worker package
npx search-deploy init

# Deploy worker
cd cloudflare-worker
npm install
npm run deploy
```

See [cloudflare-worker package](../cloudflare-worker/README.md) for details.

## Troubleshooting

### "Build directory not found"

Make sure your site is built first:

```bash
npm run build
```

Or specify the directory:

```bash
search-deploy --dir ./dist
```

### "No search index files found"

Ensure your static site generator produces `search-index-*.json` files in the expected format.

### "Configuration errors"

Run `init` to set up configuration:

```bash
search-deploy init
```

### "Authentication error"

Verify your Cloudflare credentials:

1. Check `.env` file exists with correct values
2. Verify API token has "Workers KV Storage:Edit" permission
3. Confirm account ID is correct

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│ 1. Build your site (generates search-index-*.json)     │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 2. CLI finds and reads index files                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Uploads to Cloudflare KV                             │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Worker serves search API from KV                     │
│    GET/POST /search → Returns JSON results              │
└─────────────────────────────────────────────────────────┘
```

## Related Packages

- [Cloudflare Worker](../cloudflare-worker/) - The search API implementation

## License

MIT
