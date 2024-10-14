#!/usr/bin/env bash

set -ex

cd $(dirname "$0")

npx tsc
npx esbuild src/index.ts --bundle=true --minify=true --platform=node --loader:.txt=text --format=iife --outfile=dist/random-voronoi.js

NODE_PATH=$(which node)
cp -f "$NODE_PATH" dist/random-voronoi
node --experimental-sea-config sea.json
npx postject dist/random-voronoi.exe NODE_SEA_BLOB dist/random-voronoi.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
rm dist/random-voronoi.blob
