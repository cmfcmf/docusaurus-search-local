#!/bin/bash
set -e

npm install
npm run lint
npm run build
npm run test
npm run test:e2e -- -- --browser=all

npm run build -w example-docs -- --config docusaurus.config.noTrailingSlash.js
npm run build -w example-docs -- --config docusaurus.config.subDirectory.js
npm run build -w example-docs -- --config docusaurus.config.noTrailingSlashSubdirectory.js

npx commit-and-tag-version "$@"
npm -w @cmfcmf/docusaurus-search-local pack
npm login
npm -w @cmfcmf/docusaurus-search-local publish
git push --follow-tags origin main
