import {app, BrowserWindow,ipcMain} from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const savePath = path.join(app.getPath('userData'), 'saved_timer.json');

//read saved timers
ipcMain.handle('read-timer-data', async () => {
  try {
    const fileData = await fs.promises.readFile(savePath, 'utf-8');
    if (fileData.trim()) {
      return JSON.parse(fileData);
    } else {
      return []; 
    }
  } catch (err) {
    console.error('Failed to read or parse saved_timer.json:', err);
    return []; 
  
  }
});

//write timers
ipcMain.on('write-timer-data', (event, data: string) => {

   

  fs.readFile(savePath, 'utf-8', (readErr, fileData) => {
    let entries: { date: string; time: string }[] = [];

    if (!readErr && fileData.trim()) {
      try {
        entries = JSON.parse(fileData);
      } catch (parseErr) {
        console.error('Failed to parse saved_timer.json. Starting fresh.');
        entries = [];
      }
    }


    if (entries.length >= 50) {
      entries = entries.slice(entries.length - 9);
    }

  
    const now = new Date().toISOString();
    entries.push({ date: now, time: data });

    fs.writeFile(savePath, JSON.stringify(entries, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Failed to write JSON timer data:', writeErr);
      } else {
        console.log('Timer entry saved as JSON.');
      }
    });
  });
});

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 800, 
        x: 0,
        y: 0,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'), 
        contextIsolation: true,
        nodeIntegration: false
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})