"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    writeTimerData: (data) => electron_1.ipcRenderer.send('write-timer-data', data),
    readTimerData: () => electron_1.ipcRenderer.invoke('read-timer-data'),
});
