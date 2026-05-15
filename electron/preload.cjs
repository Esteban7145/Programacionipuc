const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipucApi', {
  listSongs: () => ipcRenderer.invoke('songs:list'),
  getServerStatus: () => ipcRenderer.invoke('app:server-status')
});
