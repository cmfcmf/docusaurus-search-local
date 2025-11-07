/**
 * Configuration loading and validation
 */

import { cosmiconfig } from 'cosmiconfig';
import * as path from 'path';
import * as fs from 'fs';
import { config as loadEnv } from 'dotenv';

export interface DeployConfig {
  // Build directory
  buildDir?: string;

  // Cloudflare credentials
  cloudflare: {
    accountId: string;
    apiToken: string;
    kvNamespaceId: string;
    workerName?: string;
  };

  // Optional worker deployment
  worker?: {
    enabled?: boolean;
    dir?: string;
  };

  // Optional settings
  options?: {
    verbose?: boolean;
    dryRun?: boolean;
  };
}

/**
 * Load configuration from file or environment
 */
export async function loadConfig(
  configPath?: string,
  cliOptions?: any
): Promise<DeployConfig> {
  // Load environment variables
  loadEnv();

  // Try to find config file
  const explorer = cosmiconfig('searchdeploy', {
    searchPlaces: [
      'package.json',
      '.searchdeployrc',
      '.searchdeployrc.json',
      '.searchdeployrc.js',
      'searchdeploy.config.js',
    ],
  });

  let fileConfig: any = {};

  if (configPath) {
    const result = await explorer.load(configPath);
    fileConfig = result?.config || {};
  } else {
    const result = await explorer.search();
    fileConfig = result?.config || {};
  }

  // Auto-detect build directory
  const buildDir = cliOptions?.dir
    || fileConfig.buildDir
    || findBuildDir();

  // Merge configurations (CLI > file > env)
  const config: DeployConfig = {
    buildDir,
    cloudflare: {
      accountId:
        cliOptions?.accountId
        || fileConfig.cloudflare?.accountId
        || process.env.CLOUDFLARE_ACCOUNT_ID
        || '',
      apiToken:
        cliOptions?.apiToken
        || fileConfig.cloudflare?.apiToken
        || process.env.CLOUDFLARE_API_TOKEN
        || '',
      kvNamespaceId:
        cliOptions?.kvNamespaceId
        || fileConfig.cloudflare?.kvNamespaceId
        || process.env.CLOUDFLARE_KV_NAMESPACE_ID
        || '',
      workerName:
        fileConfig.cloudflare?.workerName
        || 'docusaurus-search-worker',
    },
    worker: fileConfig.worker || {},
    options: {
      verbose: cliOptions?.verbose || fileConfig.options?.verbose,
      dryRun: cliOptions?.dryRun || fileConfig.options?.dryRun,
    },
  };

  // Validate required fields
  validateConfig(config);

  return config;
}

/**
 * Find build directory automatically
 */
function findBuildDir(): string {
  const candidates = [
    './build',
    '../build',
    '../../build',
    './dist',
  ];

  for (const dir of candidates) {
    const fullPath = path.resolve(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      // Check if it has search index files
      const files = fs.readdirSync(fullPath);
      if (files.some(f => f.startsWith('search-index-') && f.endsWith('.json'))) {
        return fullPath;
      }
    }
  }

  // Default to ./build
  return path.resolve(process.cwd(), 'build');
}

/**
 * Validate configuration
 */
function validateConfig(config: DeployConfig): void {
  const errors: string[] = [];

  if (!config.buildDir) {
    errors.push('Build directory not specified');
  } else if (!fs.existsSync(config.buildDir)) {
    errors.push(`Build directory does not exist: ${config.buildDir}`);
  }

  if (!config.cloudflare.accountId) {
    errors.push('Cloudflare account ID not specified (set CLOUDFLARE_ACCOUNT_ID or use config file)');
  }

  if (!config.cloudflare.apiToken) {
    errors.push('Cloudflare API token not specified (set CLOUDFLARE_API_TOKEN or use config file)');
  }

  if (!config.cloudflare.kvNamespaceId) {
    errors.push('Cloudflare KV namespace ID not specified (set CLOUDFLARE_KV_NAMESPACE_ID or use config file)');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n  ${errors.join('\n  ')}\n\nRun "docusaurus-search-deploy init" to set up configuration.`);
  }
}
