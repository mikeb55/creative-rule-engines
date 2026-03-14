#!/usr/bin/env node
import * as esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const entry = path.join(root, 'engines', 'monk-barry-engine', 'pipeline.ts');
const outDir = path.join(root, 'apps', 'monk-barry-desktop', 'dist-electron');
const outfile = path.join(outDir, 'engine.bundle.js');
fs.mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile,
  external: [],
}).catch(() => process.exit(1));

console.log('Engine bundled:', outfile);
