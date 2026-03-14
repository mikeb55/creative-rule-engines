import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs';

const VERSION = 'v1.0 Clean Rebuild';
let mainWindow: BrowserWindow | null = null;

function getExportsPath(): string {
  const docs = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Documents');
  return path.join(docs, 'Monk Barry Exports');
}

function ensureExportsDir(): string {
  const p = getExportsPath();
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  return p;
}

function createWindow(): void {
  const preloadPath = path.join(__dirname, 'preload.js');
  mainWindow = new BrowserWindow({
    width: 520,
    height: 580,
    title: 'Monk Barry Composer',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  ensureExportsDir();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('generate', async (_, engine: string, instrument: string, bars: number) => {
  try {
    const { runPipeline } = require(path.join(__dirname, 'engine.bundle.js'));
    const outputDir = ensureExportsDir();
    const result = runPipeline({ engine, instrument, bars, outputDir });
    return {
      success: result.valid,
      valid: result.valid,
      xml: result.xml,
      path: path.join(outputDir, result.filename),
      filename: result.filename,
      error: result.valid ? undefined : 'Validation failed',
    };
  } catch (err) {
    return {
      success: false,
      valid: false,
      error: err instanceof Error ? err.message : 'Generation failed',
    };
  }
});

ipcMain.handle('exportMusicXML', async (_, filename: string, content: string) => {
  const win = mainWindow ?? BrowserWindow.getAllWindows()[0];
  const defaultPath = path.join(getExportsPath(), filename);
  const result = await dialog.showSaveDialog(win!, {
    title: 'Save MusicXML',
    defaultPath,
    filters: [{ name: 'MusicXML', extensions: ['musicxml'] }],
  });
  if (result.canceled || !result.filePath) return { success: false, path: '' };
  const fp = result.filePath.endsWith('.musicxml') ? result.filePath : `${result.filePath}.musicxml`;
  fs.writeFileSync(fp, content, 'utf-8');
  return { success: true, path: fp };
});

ipcMain.handle('openOutputFolder', async () => {
  const p = ensureExportsDir();
  shell.openPath(p);
  return p;
});

ipcMain.handle('getExportsPath', async () => getExportsPath());
ipcMain.handle('getVersion', async () => VERSION);
