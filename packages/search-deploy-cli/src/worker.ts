/**
 * Worker management commands
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

export async function manageWorker(options: any): Promise<void> {
  if (options.deploy) {
    console.log(chalk.bold('\n🚀 Deploying Cloudflare Worker\n'));
    await runWrangler(['deploy']);
  } else if (options.logs) {
    console.log(chalk.bold('\n📝 Tailing worker logs\n'));
    await runWrangler(['tail']);
  } else {
    console.log(chalk.yellow('No action specified. Use --deploy or --logs'));
  }
}

function runWrangler(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['wrangler', ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Wrangler exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}
