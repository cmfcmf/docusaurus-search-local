/**
 * Main deployment logic
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import chalk from 'chalk';
import ora from 'ora';
import type { DeployConfig } from './config';

interface DeployOptions {
  dryRun?: boolean;
  deployWorker?: boolean;
}

interface IndexFile {
  filename: string;
  path: string;
  key: string;
  tag: string;
  size: number;
}

/**
 * Main deploy function
 */
export async function deploy(
  config: DeployConfig,
  options: DeployOptions = {}
): Promise<void> {
  console.log(chalk.bold('\n🚀 Search Index Deploy\n'));

  if (options.dryRun) {
    console.log(chalk.yellow('DRY RUN - No changes will be made\n'));
  }

  // Find index files
  const spinner = ora('Finding search indexes...').start();
  const indexFiles = findIndexFiles(config.buildDir!);

  if (indexFiles.length === 0) {
    spinner.fail('No search index files found!');
    console.log(chalk.dim(`  Looked in: ${config.buildDir}`));
    console.log(chalk.dim('  Expected: search-index-*.json files'));
    throw new Error('No search indexes found');
  }

  spinner.succeed(`Found ${indexFiles.length} index file(s)`);

  // Display files
  console.log();
  indexFiles.forEach(file => {
    console.log(chalk.cyan('  📄 ' + file.filename));
    console.log(chalk.dim(`     Tag: ${file.tag}`));
    console.log(chalk.dim(`     Size: ${formatBytes(file.size)}`));
  });
  console.log();

  if (options.dryRun) {
    console.log(chalk.yellow('Dry run complete - no files were uploaded'));
    return;
  }

  // Upload to KV
  const uploadSpinner = ora('Uploading to Cloudflare KV...').start();

  try {
    let successCount = 0;

    for (const file of indexFiles) {
      uploadSpinner.text = `Uploading ${file.filename}...`;
      await uploadToKV(config, file);
      successCount++;
    }

    uploadSpinner.succeed(`Uploaded ${successCount} index file(s) to Cloudflare KV`);

    console.log(chalk.green('\n✅ Deployment complete!\n'));

    // Show next steps
    if (options.deployWorker) {
      console.log(chalk.dim('Worker will be deployed next...'));
      // TODO: Deploy worker
    } else {
      console.log(chalk.dim('To deploy the worker, run:'));
      console.log(chalk.dim('  docusaurus-search-deploy worker --deploy'));
    }

  } catch (error) {
    uploadSpinner.fail('Upload failed');
    throw error;
  }
}

/**
 * Find all search index files
 */
function findIndexFiles(buildDir: string): IndexFile[] {
  if (!fs.existsSync(buildDir)) {
    return [];
  }

  const files = fs.readdirSync(buildDir);

  return files
    .filter(file => file.startsWith('search-index-') && file.endsWith('.json'))
    .map(filename => {
      const filePath = path.join(buildDir, filename);
      const stats = fs.statSync(filePath);
      const tag = filename.replace('search-index-', '').replace('.json', '');

      return {
        filename,
        path: filePath,
        key: filename,
        tag,
        size: stats.size,
      };
    });
}

/**
 * Upload a file to Cloudflare KV
 */
async function uploadToKV(
  config: DeployConfig,
  file: IndexFile
): Promise<void> {
  return new Promise((resolve, reject) => {
    const content = fs.readFileSync(file.path, 'utf8');
    const url = `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/storage/kv/namespaces/${config.cloudflare.kvNamespaceId}/values/${file.key}`;

    const options = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.cloudflare.apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content),
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
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

/**
 * Format bytes for display
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
