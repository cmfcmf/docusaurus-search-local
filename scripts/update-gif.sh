#!/bin/bash
set -ev
yarn cypress run
ffmpeg -y -ss 3 -i cypress/videos/create-gif.js.mp4 -vf "fps=10,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 docs/preview.gif