#!/usr/bin/env node

/**
 * Upload search indexes to Cloudflare KV
 *
 * This script uploads all search-index-*.json files from a Docusaurus build
 * directory to a Cloudflare KV namespace.
 *
 * Usage:
 *   node scripts/upload-indexes.js <build-dir> [options]
 *
 * Options:
 *   --namespace-id <id>    KV namespace ID (or set CLOUDFLARE_KV_NAMESPACE_ID env var)
 *   --account-id <id>      Cloudflare account ID (or set CLOUDFLARE_ACCOUNT_ID env var)
 *   --api-token <token>    Cloudflare API token (or set CLOUDFLARE_API_TOKEN env var)
 *   --preview             Upload to preview namespace instead
 *   --dry-run             Show what would be uploaded without actually uploading
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    buildDir: args[0],
    namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    preview: false,
    dryRun: false,
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--namespace-id':
        config.namespaceId = args[++i];
        break;
      case '--account-id':
        config.accountId = args[++i];
        break;
      case '--api-token':
        config.apiToken = args[++i];
        break;
      case '--preview':
        config.preview = true;
        break;
      case '--dry-run':
        config.dryRun = true;
        break;
      default:
        console.warn(`Unknown option: ${args[i]}`);
    }
  }

  return config;
}

// Validate configuration
function validateConfig(config) {
  const errors = [];

  if (!config.buildDir) {
    errors.push('Build directory is required (first argument)');
  } else if (!fs.existsSync(config.buildDir)) {
    errors.push(`Build directory does not exist: ${config.buildDir}`);
  }

  if (!config.namespaceId) {
    errors.push('KV namespace ID is required (--namespace-id or CLOUDFLARE_KV_NAMESPACE_ID env var)');
  }

  if (!config.accountId) {
    errors.push('Cloudflare account ID is required (--account-id or CLOUDFLARE_ACCOUNT_ID env var)');
  }

  if (!config.apiToken) {
    errors.push('Cloudflare API token is required (--api-token or CLOUDFLARE_API_TOKEN env var)');
  }

  if (errors.length > 0) {
    console.error('Configuration errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error('\nUsage: node scripts/upload-indexes.js <build-dir> [options]');
    process.exit(1);
  }
}

// Find all search index files
function findIndexFiles(buildDir) {
  const files = fs.readdirSync(buildDir);
  return files
    .filter(file => file.startsWith('search-index-') && file.endsWith('.json'))
    .map(file => ({
      filename: file,
      path: path.join(buildDir, file),
      key: file, // KV key will be the filename
      tag: file.replace('search-index-', '').replace('.json', '')
    }));
}

// Upload a single file to KV
async function uploadToKV(config, file, content) {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${file.key}`;

    const options = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, response: JSON.parse(data) });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(content);
    req.end();
  });
}

// Format bytes for display
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Main function
async function main() {
  const config = parseArgs();
  validateConfig(config);

  console.log('Docusaurus Search Local - Index Upload');
  console.log('======================================\n');
  console.log(`Build directory: ${config.buildDir}`);
  console.log(`KV Namespace ID: ${config.namespaceId}`);
  console.log(`Account ID: ${config.accountId}`);
  console.log(`Mode: ${config.preview ? 'Preview' : 'Production'}`);
  if (config.dryRun) {
    console.log('DRY RUN - No files will be uploaded\n');
  }
  console.log('');

  // Find index files
  const indexFiles = findIndexFiles(config.buildDir);

  if (indexFiles.length === 0) {
    console.error('No search index files found in build directory!');
    console.error('Expected files matching: search-index-*.json');
    process.exit(1);
  }

  console.log(`Found ${indexFiles.length} index file(s):\n`);

  // Display files to upload
  indexFiles.forEach(file => {
    const stats = fs.statSync(file.path);
    console.log(`  ${file.filename}`);
    console.log(`    Tag: ${file.tag}`);
    console.log(`    Size: ${formatBytes(stats.size)}`);
    console.log(`    KV Key: ${file.key}`);
    console.log('');
  });

  if (config.dryRun) {
    console.log('Dry run complete. No files were uploaded.');
    return;
  }

  // Upload files
  console.log('Uploading to Cloudflare KV...\n');

  let successCount = 0;
  let failCount = 0;

  for (const file of indexFiles) {
    try {
      console.log(`Uploading ${file.filename}...`);
      const content = fs.readFileSync(file.path, 'utf8');
      await uploadToKV(config, file, content);
      console.log(`  ✓ Success`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
      failCount++;
    }
    console.log('');
  }

  console.log('Upload complete!');
  console.log(`  Successful: ${successCount}`);
  console.log(`  Failed: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
