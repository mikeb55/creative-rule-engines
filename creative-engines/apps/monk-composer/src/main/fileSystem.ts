export interface FileSystemAPI {
  readEngine: (name: string) => Promise<string>;
  listEngines: () => Promise<string[]>;
  getOutputsPath: () => Promise<string>;
  getPresetsPath: () => Promise<string>;
  getDefaultExportPath: () => Promise<string>;
  showOpenDirectoryDialog: () => Promise<{ canceled: boolean; path: string }>;
  openPath: (dirPath: string) => Promise<string>;
  exportMusicXML: (exportPath: string, filename: string, content: string) => Promise<{ success: boolean; path: string }>;
  savePreset: (name: string, content: string) => Promise<boolean>;
  loadPreset: (name: string) => Promise<string>;
  listPresets: () => Promise<string[]>;
}

declare global {
  interface Window {
    electronAPI?: FileSystemAPI;
  }
}

export const fsAPI: FileSystemAPI | null = typeof window !== 'undefined' ? window.electronAPI ?? null : null;
