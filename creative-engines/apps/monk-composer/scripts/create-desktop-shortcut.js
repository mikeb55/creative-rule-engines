#!/usr/bin/env node
/**
 * Creates a Windows desktop shortcut for Monk Composer.
 * Runs automatically after build (postbuild).
 */

const path = require('path');
const fs = require('fs');

const SHORTCUT_NAME = 'Monk Composer';

function getDesktopPath() {
  return path.join(process.env.USERPROFILE || process.env.HOME || '', 'Desktop');
}

function findExecutable() {
  const releaseDir = path.join(__dirname, '..', 'release');
  if (!fs.existsSync(releaseDir)) return null;

  const portable = path.join(releaseDir, 'Monk Composer.exe');
  if (fs.existsSync(portable)) return portable;

  const winUnpacked = path.join(releaseDir, 'win-unpacked', 'Monk Composer.exe');
  if (fs.existsSync(winUnpacked)) return winUnpacked;

  const nsisDir = path.join(releaseDir, 'Monk Composer Setup 1.0.0.exe');
  if (fs.existsSync(nsisDir)) return nsisDir;

  const dirs = fs.readdirSync(releaseDir) || [];
  for (const d of dirs) {
    const exe = path.join(releaseDir, d, 'Monk Composer.exe');
    if (fs.existsSync(exe)) return exe;
  }
  return null;
}

function createShortcutViaWsh(targetPath, shortcutPath) {
  const workDir = path.dirname(targetPath);
  const script = [
    'Set sh = CreateObject("WScript.Shell")',
    'Set sc = sh.CreateShortcut("' + shortcutPath.replace(/"/g, '""') + '")',
    'sc.TargetPath = "' + targetPath.replace(/"/g, '""') + '"',
    'sc.WorkingDirectory = "' + workDir.replace(/"/g, '""') + '"',
    'sc.Description = "Monk Composer - Creative Rule Engines"',
    'sc.Save()',
  ].join('\n');
  const scriptPath = path.join(__dirname, 'create-shortcut-temp.vbs');
  fs.writeFileSync(scriptPath, script, 'utf8');
  try {
    require('child_process').execSync('cscript //nologo "' + scriptPath + '"', {
      windowsHide: true,
    });
  } finally {
    try { fs.unlinkSync(scriptPath); } catch {}
  }
}

function main() {
  if (process.platform !== 'win32') {
    console.log('Desktop shortcut creation skipped (not Windows)');
    return;
  }

  const exe = findExecutable();
  if (!exe) {
    console.log('Monk Composer: Executable not found in release folder. Run build first.');
    return;
  }

  const desktop = getDesktopPath();
  const shortcutPath = path.join(desktop, `${SHORTCUT_NAME}.lnk`);

  try {
    createShortcutViaWsh(exe, shortcutPath);
    console.log(`Desktop shortcut created: ${shortcutPath}`);
  } catch (err) {
    console.log('Could not create shortcut:', err.message);
  }
}

main();
