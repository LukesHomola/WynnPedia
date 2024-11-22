import { contextBridge, ipcRenderer }  from("electron");
console.log("Preload script is loaded");

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded in Preload");
});

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
});
