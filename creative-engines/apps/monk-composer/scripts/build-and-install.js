#!/usr/bin/env node
/**
 * Full build and install automation:
 * 1. Install dependencies
 * 2. Build Electron app
 * 3. Create desktop shortcut
 * 4. Verify outputs
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { ...opts, cwd: root, stdio: 'inherit' });
}

function main() {
  console.log('Monk Composer - Build and Install\n');

  console.log('1. Installing dependencies...');
  run('npm install');

  console.log('\n2. Building Electron app...');
  run('npm run electron:build');

  console.log('\n3. Creating desktop shortcut...');
  run('node scripts/create-desktop-shortcut.js');

  console.log('\n4. Verifying...');
  const releaseDir = path.join(root, 'release');
  const outputsDir = path.join(root, 'outputs');

  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir);
    console.log('   Release folder:', files.join(', '));
  }

  if (fs.existsSync(outputsDir)) {
    const files = fs.readdirSync(outputsDir).filter(f => f.endsWith('.musicxml'));
    console.log('   Example MusicXML files:', files.join(', '));
  }

  console.log('\nDone. Launch Monk Composer from the desktop shortcut.');
}

main();
