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
  savePreset: (name: string, content: string) =>
    ipcRenderer.invoke('fs:savePreset', name, content),
  loadPreset: (name: string) => ipcRenderer.invoke('fs:loadPreset', name),
  listPresets: () => ipcRenderer.invoke('fs:listPresets'),
});
