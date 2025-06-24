import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  writeTimerData: (data: string) => ipcRenderer.send('write-timer-data', data),
  readTimerData: () => ipcRenderer.invoke('read-timer-data'),
});

