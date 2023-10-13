#!/usr/bin/env bash
pnpm esbuild --bundle --format=esm --outfile=src/gen/prebuilt.js \
  src/prebuild/renderer.ts
# pnpm esbuild --bundle --format=esm --outfile=src/gen/headlessui-react.js \
#   --external:react \
#   --external:react/jsx-runtime \
#   --external:react-dom \
#   src/prebuild/headlessui-react.ts
