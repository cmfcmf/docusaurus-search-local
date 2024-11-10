#!/bin/bash
set -e

pnpm install --frozen-lockfile
pnpm run lint
pnpm run build
pnpm run test
pnpm run test:e2e -- -- --browser=all

pnpm run build -w example-docs -- --config docusaurus.config.noTrailingSlash.js
pnpm run build -w example-docs -- --config docusaurus.config.subDirectory.js
pnpm run build -w example-docs -- --config docusaurus.config.noTrailingSlashSubdirectory.js

pnpm exec commit-and-tag-version "$@"
pnpm -w @cmfcmf/docusaurus-search-local pack
npm login
pnpm -w @cmfcmf/docusaurus-search-local publish
git push --follow-tags origin main
