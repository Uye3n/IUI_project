import {app, BrowserWindow,ipcMain} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import psList from 'ps-list';

const savePath_timer = path.join(app.getPath('userData'), 'saved_timer.json');
const savePath_apps = path.join(app.getPath('userData'), 'saved_apps.json');
const normalizeName = (name: string) =>
  name.trim().toLowerCase().replace(/\.exe$/, '');


//read saved timers
ipcMain.handle('read-timer-data', async () => {
  try {
    const fileData = await fs.promises.readFile(savePath_timer, 'utf-8');
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

//detect running applications
ipcMain.handle('detect-running-apps', async (event, blocked_apps: string[]) => {
  const processes = await psList();
  const apps: {name: string, running: boolean}[] = [];

  for (var blocked of blocked_apps) {
    apps.push({ name: blocked, 
      running: processes.some(p => normalizeName(p.name).includes(normalizeName(blocked))) 
    });
  }

  return apps;
});

//read saved applications
ipcMain.handle('read-applications-data', async () => {
  try {
    const fileData = await fs.promises.readFile(savePath_apps, 'utf-8');
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

//save applications
ipcMain.on('write-applications-data', (event, data) => {
  fs.readFile(savePath_apps, 'utf-8', (readErr, fileData) => {
    let entries: any[] = [];

    if (!readErr && fileData.trim()) {
      try {
        entries = JSON.parse(fileData);
      } catch (parseErr) {
        console.error('Failed to parse saved_apps.json. Starting fresh.');
        entries = [];
      }
    }

    entries.push(data);

    fs.writeFile(savePath_apps, JSON.stringify(entries, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Failed to write saved_apps.json:', writeErr);
      } else {
        console.log('Applications data saved as JSON.');
      }
    });
  });
});

//write timers
ipcMain.on('write-timer-data', (event, data: string) => {

   

  fs.readFile(savePath_timer, 'utf-8', (readErr, fileData) => {
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
      entries = entries.slice(entries.length - 20);
    }

  
    const now = new Date().toISOString();
    entries.push({ date: now, time: data });

    fs.writeFile(savePath_timer, JSON.stringify(entries, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Failed to write JSON timer data:', writeErr);
      } else {
        console.log('Timer entry saved as JSON.');
      }
    });
  });
});

function createWindow() {

    const mainWindow = new BrowserWindow({
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

    mainWindow.loadFile('index.html')
    
}

app.whenReady().then(() => {
  createWindow()
})