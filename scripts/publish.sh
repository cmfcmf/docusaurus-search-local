#!/bin/bash
set -e
yarn build
yarn test
./scripts/update-gif.sh
echo ""
echo ""
echo "Please view and commit the updated gif and press enter to continue."
echo ""
echo ""
read
yarn publish