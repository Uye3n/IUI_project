import {screen, app, BrowserWindow} from 'electron';
import * as path from 'path';

function createWindow() {
    
    const primaryDisplay = screen.getPrimaryDisplay();
    const {width, height} = primaryDisplay.size;

    const win = new BrowserWindow({
        width: width * 0.75,
        height: height * 0.75, 
        x: 0,
        y: 0,
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})