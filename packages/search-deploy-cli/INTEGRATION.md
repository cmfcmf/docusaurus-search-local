# Integration with Docusaurus Plugin

This document shows how to integrate automatic deployment into the existing `@cmfcmf/docusaurus-search-local` plugin.

## Option 1: Automatic Deployment (Recommended)

Add a `deploy` option to the plugin that automatically deploys indexes after building them.

### Plugin Configuration

```typescript
// In packages/docusaurus-search-local/src/server/index.ts

interface PluginOptions {
  // ... existing options ...

  deploy?: {
    enabled?: boolean;
    type?: 'cloudflare';
    config?: DeployConfig;
  };
}
```

### Implementation

Add to the `postBuild` hook (after index generation):

```typescript
// At the end of postBuild hook
async postBuild(props: PostBuildProps) {
  // ... existing index building code ...

  // Deploy indexes if enabled
  if (options.deploy?.enabled) {
    logger.info('Deploying search indexes...');

    try {
      const { deploy, loadConfig } = await import('@cmfcmf/docusaurus-search-deploy');
      const config = await loadConfig(undefined, {
        dir: outDir,
        ...options.deploy.config,
      });

      await deploy(config, { dryRun: false });
      logger.info('Search indexes deployed successfully!');
    } catch (error) {
      logger.error('Failed to deploy search indexes:', error);
      // Don't fail the build
    }
  }
}
```

### User Configuration

```javascript
// docusaurus.config.js
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
          // Credentials from environment variables
        },
      },
    ],
  ],
};
```

## Option 2: npm Scripts Integration

Users can add deployment to their build scripts:

```json
{
  "scripts": {
    "build": "docusaurus build",
    "postbuild": "docusaurus-search-deploy",
    "deploy": "npm run build"
  }
}
```

## Option 3: GitHub Actions

Fully automated deployment on push:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build

      - name: Deploy Search Indexes
        env:
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_KV_NAMESPACE_ID: ${{ secrets.CLOUDFLARE_KV_NAMESPACE_ID }}
        run: npx docusaurus-search-deploy
```

## Complete Example

### 1. Install Packages

```bash
npm install --save @cmfcmf/docusaurus-search-local
npm install --save-dev @cmfcmf/docusaurus-search-deploy
```

### 2. Configure Plugin

```javascript
// docusaurus.config.js
module.exports = {
  plugins: [
    [
      '@cmfcmf/docusaurus-search-local',
      {
        indexDocs: true,
        indexBlog: true,
        indexPages: true,

        // Optional: automatic deployment
        deploy: {
          enabled: process.env.CI === 'true', // Only in CI
          type: 'cloudflare',
        },
      },
    ],
  ],
};
```

### 3. Set Environment Variables

```bash
# .env (local) or CI secrets
CLOUDFLARE_ACCOUNT_ID=abc123
CLOUDFLARE_API_TOKEN=your-token
CLOUDFLARE_KV_NAMESPACE_ID=xyz789
```

### 4. Build

```bash
# Local development (no deploy)
npm run build

# Production (with deploy)
CI=true npm run build
```

## Benefits

1. **Seamless Integration**: No manual steps required
2. **Automatic Updates**: Indexes deployed every build
3. **Environment-Aware**: Deploy only in production/CI
4. **Error Handling**: Build succeeds even if deploy fails
5. **Configurable**: Easy to enable/disable

## Migration Path

For existing users:

1. Install CLI tool: `npm install --save-dev @cmfcmf/docusaurus-search-deploy`
2. Run init: `npx docusaurus-search-deploy init`
3. Add to scripts: `"postbuild": "docusaurus-search-deploy"`
4. Done! Next build will automatically deploy

## Comparison

| Approach | Setup | Automation | Flexibility |
|----------|-------|------------|-------------|
| **Plugin Option** | Minimal | Full | Limited |
| **npm Scripts** | Simple | Good | Good |
| **GitHub Actions** | Medium | Full | Excellent |
| **Manual CLI** | None | None | Full |

Choose based on your needs:
- **Just want it to work?** → Use plugin option
- **Want control over when?** → Use npm scripts
- **Complex CI/CD?** → Use GitHub Actions
- **Custom logic needed?** → Use programmatic API
