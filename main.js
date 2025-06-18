"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function createWindow() {
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const win = new electron_1.BrowserWindow({
        width: width * 0.75,
        height: height * 0.75,
        x: 0,
        y: 0,
    });
    win.loadFile('index.html');
}
electron_1.app.whenReady().then(() => {
    createWindow();
});
