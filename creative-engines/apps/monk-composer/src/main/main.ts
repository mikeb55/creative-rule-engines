import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs';

let mainWindow: BrowserWindow | null = null;

function getEnginesPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'engines');
  }
  return path.join(__dirname, '../../../engines');
}

function getOutputsPath(): string {
  return path.join(app.getPath('userData'), 'outputs');
}

function getDefaultExportPath(): string {
  return path.join(app.getPath('documents'), 'Monk Composer Exports');
}

function getPresetsPath(): string {
  return path.join(app.getPath('userData'), 'presets');
}

function ensureDir(p: string): void {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function getPreloadPath(): string {
  const base = path.join(__dirname, 'preload');
  const js = base + '.js';
  const mjs = base + '.mjs';
  try {
    if (fs.existsSync(js)) return js;
    if (fs.existsSync(mjs)) return mjs;
  } catch {
    // fallthrough
  }
  return js;
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    title: 'Monk Composer - Creative Rule Engines',
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../../assets/app-icon.png'),
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ensureDir(getOutputsPath());
  ensureDir(getPresetsPath());
  ensureDir(getDefaultExportPath());
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('fs:readFile', async (_, filePath: string): Promise<string> => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
});

ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string): Promise<boolean> => {
  try {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('fs:readEngine', async (_, name: string): Promise<string> => {
  const enginesPath = getEnginesPath();
  const filePath = path.join(enginesPath, `${name}.md`);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
});

ipcMain.handle('fs:listEngines', async (): Promise<string[]> => {
  const enginesPath = getEnginesPath();
  try {
    if (!fs.existsSync(enginesPath)) return [];
    return fs.readdirSync(enginesPath)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
  } catch {
    return [];
  }
});

ipcMain.handle('fs:getOutputsPath', async (): Promise<string> => {
  ensureDir(getOutputsPath());
  return getOutputsPath();
});

ipcMain.handle('fs:getPresetsPath', async (): Promise<string> => {
  ensureDir(getPresetsPath());
  return getPresetsPath();
});

ipcMain.handle('fs:getAppPath', async (): Promise<string> => {
  return app.getPath('userData');
});

ipcMain.handle('fs:getDefaultExportPath', async (): Promise<string> => {
  const p = getDefaultExportPath();
  ensureDir(p);
  return p;
});

ipcMain.handle('fs:showOpenDirectoryDialog', async (): Promise<{ canceled: boolean; path: string }> => {
  const win = mainWindow ?? BrowserWindow.getAllWindows()[0] ?? null;
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    title: 'Select Export Folder',
    defaultPath: getDefaultExportPath(),
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true, path: '' };
  }
  return { canceled: false, path: result.filePaths[0] };
});

ipcMain.handle('fs:openPath', async (_, dirPath: string): Promise<string> => {
  return shell.openPath(dirPath);
});

ipcMain.handle('fs:exportMusicXML', async (_, exportPath: string, filename: string, content: string): Promise<{ success: boolean; path: string }> => {
  const baseName = filename.endsWith('.musicxml') ? filename : `${filename}.musicxml`;
  const fullPath = path.join(exportPath, baseName);
  try {
    ensureDir(exportPath);
    fs.writeFileSync(fullPath, content, 'utf-8');
    return { success: true, path: fullPath };
  } catch {
    return { success: false, path: '' };
  }
});

ipcMain.handle('fs:savePreset', async (_, name: string, content: string): Promise<boolean> => {
  const presetPath = path.join(getPresetsPath(), `${name}.json`);
  return fs.writeFileSync(presetPath, content, 'utf-8') !== undefined;
});

ipcMain.handle('fs:loadPreset', async (_, name: string): Promise<string> => {
  const presetPath = path.join(getPresetsPath(), `${name}.json`);
  try {
    return fs.readFileSync(presetPath, 'utf-8');
  } catch {
    return '';
  }
});

ipcMain.handle('fs:listPresets', async (): Promise<string[]> => {
  const presetsPath = getPresetsPath();
  try {
    if (!fs.existsSync(presetsPath)) return [];
    return fs.readdirSync(presetsPath)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
  } catch {
    return [];
  }
});
