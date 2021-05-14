#!/bin/bash
set -e
yarn build:server
yarn build:client
yarn test
yarn lint
yarn publish