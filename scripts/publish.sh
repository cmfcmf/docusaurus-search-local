#!/bin/bash
set -e
yarn install
yarn lint
yarn build

yarn test

yarn --cwd packages/example-docs serve &
yarn test:e2e
pkill -9 -f packages/example-docs

yarn lerna publish
