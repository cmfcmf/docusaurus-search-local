# Docusaurus Search Deploy CLI

A CLI tool to seamlessly deploy Docusaurus Search Local indexes to Cloudflare Workers as part of your build process.

## Installation

```bash
npm install --save-dev @cmfcmf/docusaurus-search-deploy
```

## Quick Start

### 1. Initialize

```bash
npx docusaurus-search-deploy init
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
    "build": "docusaurus build",
    "postbuild": "docusaurus-search-deploy"
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
# Deploy with default config
docusaurus-search-deploy

# Deploy with custom config
docusaurus-search-deploy --config ./my-config.json

# Deploy with custom build directory
docusaurus-search-deploy --dir ./dist

# Dry run (show what would be deployed)
docusaurus-search-deploy --dry-run

# Deploy indexes AND worker
docusaurus-search-deploy --worker
```

### Worker Commands

```bash
# Deploy the Cloudflare Worker
docusaurus-search-deploy worker --deploy

# View worker logs
docusaurus-search-deploy worker --logs
```

### Init Command

```bash
# Interactive setup
docusaurus-search-deploy init

# With custom worker directory
docusaurus-search-deploy init --worker-dir ./custom/path
```

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
    "workerName": "docusaurus-search-worker"
  },
  "worker": {
    "enabled": true,
    "dir": "./packages/cloudflare-worker"
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
    workerName: 'docusaurus-search-worker',
  },
  worker: {
    enabled: true,
    dir: './packages/cloudflare-worker',
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
    "build": "docusaurus build",
    "postbuild": "docusaurus-search-deploy",
    "deploy": "npm run build",
    "deploy:worker": "docusaurus-search-deploy worker --deploy"
  }
}
```

### With GitHub Actions

```yaml
name: Deploy Documentation

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
        run: npx docusaurus-search-deploy
```

### With Docusaurus Plugin (Automatic)

Add to your `docusaurus.config.js`:

```javascript
module.exports = {
  plugins: [
    [
      '@cmfcmf/docusaurus-search-local',
      {
        indexDocs: true,
        indexBlog: true,
        // Enable automatic deployment
        deploy: {
          enabled: process.env.NODE_ENV === 'production',
          type: 'cloudflare',
          // Config will be loaded from .searchdeployrc.json
        },
      },
    ],
  ],
};
```

Now indexes are automatically deployed when you run `docusaurus build`!

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
🚀 Docusaurus Search Deploy

✓ Found 2 index file(s)

  📄 search-index-default.json
     Tag: default
     Size: 245.67 KB

  📄 search-index-docs-v2.0.json
     Tag: docs-v2.0
     Size: 180.34 KB

⠋ Uploading to Cloudflare KV...
✓ Uploaded 2 index file(s) to Cloudflare KV

✅ Deployment complete!
```

## Troubleshooting

### "Build directory not found"

Make sure you've built your Docusaurus site first:

```bash
npm run build
```

Or specify the directory:

```bash
docusaurus-search-deploy --dir ./dist
```

### "No search index files found"

Ensure the `@cmfcmf/docusaurus-search-local` plugin is installed and configured in your Docusaurus site.

### "Configuration errors"

Run `init` to set up configuration:

```bash
docusaurus-search-deploy init
```

### "Authentication error"

Verify your Cloudflare credentials:

1. Check `.env` file exists with correct values
2. Verify API token has "Workers KV Storage:Edit" permission
3. Confirm account ID is correct

## Advanced Usage

### Custom Deployment Logic

Create a custom deployment script:

```javascript
// deploy-search.js
const { deploy, loadConfig } = require('@cmfcmf/docusaurus-search-deploy');

async function customDeploy() {
  const config = await loadConfig();

  // Add custom logic before deployment
  console.log('Running pre-deployment checks...');

  await deploy(config);

  // Add custom logic after deployment
  console.log('Sending deployment notification...');
}

customDeploy();
```

### Multiple Environments

Use different configs for different environments:

```bash
# Development
docusaurus-search-deploy --config .searchdeployrc.dev.json

# Staging
docusaurus-search-deploy --config .searchdeployrc.staging.json

# Production
docusaurus-search-deploy --config .searchdeployrc.prod.json
```

## Related Packages

- [@cmfcmf/docusaurus-search-local](https://www.npmjs.com/package/@cmfcmf/docusaurus-search-local) - The main search plugin
- [@cmfcmf/docusaurus-search-local-worker](https://www.npmjs.com/package/@cmfcmf/docusaurus-search-local-worker) - Cloudflare Worker implementation

## License

MIT
