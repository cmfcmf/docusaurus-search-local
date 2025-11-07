#!/usr/bin/env node

/**
 * Search Deploy CLI
 *
 * Deploys Lunr search indexes to Cloudflare Workers KV as part of your build process
 */

import { Command } from 'commander';
import { deploy } from './deploy';
import { init } from './init';
import { loadConfig } from './config';
import { version } from '../package.json';

const program = new Command();

program
  .name('search-deploy')
  .description('Deploy Lunr search indexes to Cloudflare Workers')
  .version(version);

// Deploy command (default)
program
  .command('deploy', { isDefault: true })
  .description('Deploy search indexes to Cloudflare KV')
  .option('-d, --dir <path>', 'Build directory containing search indexes')
  .option('-c, --config <path>', 'Path to config file')
  .option('--dry-run', 'Show what would be deployed without deploying')
  .option('--worker', 'Also deploy the worker (default: only upload indexes)')
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config, options);
      await deploy(config, {
        dryRun: options.dryRun,
        deployWorker: options.worker,
      });
    } catch (error) {
      console.error('Deploy failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Init command
program
  .command('init')
  .description('Initialize configuration for search deployment')
  .option('--worker-dir <path>', 'Path to worker directory (if different from default)')
  .action(async (options) => {
    try {
      await init(options);
    } catch (error) {
      console.error('Init failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Worker command
program
  .command('worker')
  .description('Manage the Cloudflare Worker')
  .option('-d, --deploy', 'Deploy the worker')
  .option('-l, --logs', 'Tail worker logs')
  .action(async (options) => {
    const { manageWorker } = await import('./worker');
    try {
      await manageWorker(options);
    } catch (error) {
      console.error('Worker command failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
