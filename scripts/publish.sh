#!/bin/bash
set -e
yarn install
yarn --cwd packages/docusaurus-search-local build:server
yarn --cwd packages/docusaurus-search-local build:client
yarn --cwd packages/example-docs            build
yarn --cwd packages/docusaurus-search-local test
yarn --cwd packages/docusaurus-search-local lint
yarn --cwd packages/docusaurus-search-local publish
