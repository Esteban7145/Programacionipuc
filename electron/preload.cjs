const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipucApi', {
  listSongs: () => ipcRenderer.invoke('songs:list')
});
