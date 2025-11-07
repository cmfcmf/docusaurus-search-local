/**
 * Interactive initialization
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export async function init(options: any): Promise<void> {
  console.log(chalk.bold('\n🎯 Docusaurus Search Deploy - Setup\n'));

  console.log('This will create a configuration file for deploying your search indexes.\n');

  // Check if config already exists
  const configPath = path.join(process.cwd(), '.searchdeployrc.json');
  if (fs.existsSync(configPath)) {
    console.log(chalk.yellow('⚠️  Configuration file already exists!'));
    console.log(chalk.dim(`   ${configPath}\n`));
    return;
  }

  console.log(chalk.cyan('Step 1: Get your Cloudflare credentials'));
  console.log(chalk.dim('  1. Create a KV namespace:'));
  console.log(chalk.dim('     npx wrangler kv:namespace create SEARCH_INDEXES'));
  console.log(chalk.dim('  2. Get your Account ID from:'));
  console.log(chalk.dim('     https://dash.cloudflare.com/ → Workers & Pages → Overview'));
  console.log(chalk.dim('  3. Create an API token at:'));
  console.log(chalk.dim('     https://dash.cloudflare.com/profile/api-tokens'));
  console.log(chalk.dim('     (Use "Edit Cloudflare Workers" template)\n'));

  console.log(chalk.cyan('Step 2: Set environment variables'));
  console.log(chalk.dim('  Add to your .env file or CI/CD secrets:\n'));

  const envExample = `# Cloudflare credentials
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_KV_NAMESPACE_ID=your-kv-namespace-id
`;

  console.log(chalk.gray(envExample));

  // Create .env.example if it doesn't exist
  const envExamplePath = path.join(process.cwd(), '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, envExample);
    console.log(chalk.green('✅ Created .env.example file'));
  }

  // Create a basic config file
  const config = {
    $schema: 'https://raw.githubusercontent.com/cmfcmf/docusaurus-search-local/main/packages/search-deploy-cli/schema.json',
    buildDir: './build',
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      kvNamespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID || '',
      workerName: 'docusaurus-search-worker',
    },
    worker: {
      enabled: true,
      dir: options.workerDir || './packages/cloudflare-worker',
    },
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  console.log(chalk.green(`\n✅ Created configuration file: ${configPath}`));

  console.log(chalk.cyan('\nStep 3: Add to your package.json scripts:'));
  console.log(chalk.gray(`
{
  "scripts": {
    "build": "docusaurus build",
    "deploy": "docusaurus-search-deploy"
  }
}
`));

  console.log(chalk.cyan('Step 4: Deploy!'));
  console.log(chalk.dim('  npm run build'));
  console.log(chalk.dim('  npm run deploy\n'));

  console.log(chalk.green('✨ Setup complete!\n'));
}
