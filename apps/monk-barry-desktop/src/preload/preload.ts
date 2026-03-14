import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  generate: (engine: string, instrument: string, bars: number) =>
    ipcRenderer.invoke('generate', engine, instrument, bars),
  exportMusicXML: (filename: string, content: string) =>
    ipcRenderer.invoke('exportMusicXML', filename, content),
  openOutputFolder: () => ipcRenderer.invoke('openOutputFolder'),
  getExportsPath: () => ipcRenderer.invoke('getExportsPath'),
  getVersion: () => ipcRenderer.invoke('getVersion'),
});
