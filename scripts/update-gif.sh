#!/bin/bash
set -ev
node --unhandled-rejections=strict scripts/create-gif.js
ffmpeg -y -ss 3 -i scripts/preview.webm -vf "fps=10,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 docs/preview.gif
rm scripts/preview.webm