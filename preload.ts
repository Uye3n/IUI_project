import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  writeTimerData: (data: string) => ipcRenderer.send('write-timer-data', data),
  readTimerData: () => ipcRenderer.invoke('read-timer-data'),
  detectRunningApps: (blocked_apps: string[]) => ipcRenderer.invoke('detect-running-apps', blocked_apps),
  writeAppsData: (data_apps: any) => ipcRenderer.send('write-applications-data', data_apps),
  readAppsData: () => ipcRenderer.invoke('read-applications-data'),

});

