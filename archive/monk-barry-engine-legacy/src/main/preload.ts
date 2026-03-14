import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('fs:ping'),
  readEngine: (name: string) => ipcRenderer.invoke('fs:readEngine', name),
  listEngines: () => ipcRenderer.invoke('fs:listEngines'),
  getOutputsPath: () => ipcRenderer.invoke('fs:getOutputsPath'),
  getPresetsPath: () => ipcRenderer.invoke('fs:getPresetsPath'),
  getDefaultExportPath: () => ipcRenderer.invoke('fs:getDefaultExportPath'),
  showOpenDirectoryDialog: () => ipcRenderer.invoke('fs:showOpenDirectoryDialog'),
  openPath: (dirPath: string) => ipcRenderer.invoke('fs:openPath', dirPath),
  exportMusicXML: (exportPath: string, filename: string, content: string) =>
    ipcRenderer.invoke('fs:exportMusicXML', exportPath, filename, content),
  exportMusicXMLWithDialog: (defaultFilename: string, content: string) =>
    ipcRenderer.invoke('fs:exportMusicXMLWithDialog', defaultFilename, content),
  exportDiagnosticsJSON: (exportPath: string, baseFilename: string, content: string) =>
    ipcRenderer.invoke('fs:exportDiagnosticsJSON', exportPath, baseFilename, content),
  exportDiagnosticsJSONWithDialog: (defaultBaseFilename: string, content: string) =>
    ipcRenderer.invoke('fs:exportDiagnosticsJSONWithDialog', defaultBaseFilename, content),
  savePreset: (name: string, content: string) =>
    ipcRenderer.invoke('fs:savePreset', name, content),
  savePresetWithDialog: (defaultName: string, content: string) =>
    ipcRenderer.invoke('fs:savePresetWithDialog', defaultName, content),
  loadPreset: (name: string) => ipcRenderer.invoke('fs:loadPreset', name),
  loadPresetFromFile: () => ipcRenderer.invoke('fs:loadPresetFromFile'),
  listPresets: () => ipcRenderer.invoke('fs:listPresets'),
});
