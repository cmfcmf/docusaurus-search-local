#!/bin/bash
set -e

if [[ -z "${GH_TOKEN}" ]]; then
  echo 'GH_TOKEN must be set to publish this package. Generate one at https://github.com/settings/tokens/new'
  exit 1
fi

yarn install
yarn lint
yarn build

yarn test

yarn --cwd packages/example-docs serve &
yarn test:e2e
pkill -9 -f packages/example-docs

yarn --cwd packages/example-docs build --config docusaurus.config.noTrailingSlash.js
yarn --cwd packages/example-docs build --config docusaurus.config.subDirectory.js
yarn --cwd packages/example-docs build --config docusaurus.config.noTrailingSlashSubdirectory.js

yarn lerna publish "$@"