"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const savePath = path.join(electron_1.app.getPath('userData'), 'saved_timer.json');
//read saved timers
electron_1.ipcMain.handle('read-timer-data', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileData = yield fs.promises.readFile(savePath, 'utf-8');
        if (fileData.trim()) {
            return JSON.parse(fileData);
        }
        else {
            return [];
        }
    }
    catch (err) {
        console.error('Failed to read or parse saved_timer.json:', err);
        return [];
    }
}));
//write timers
electron_1.ipcMain.on('write-timer-data', (event, data) => {
    fs.readFile(savePath, 'utf-8', (readErr, fileData) => {
        let entries = [];
        if (!readErr && fileData.trim()) {
            try {
                entries = JSON.parse(fileData);
            }
            catch (parseErr) {
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
            }
            else {
                console.log('Timer entry saved as JSON.');
            }
        });
    });
});
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 800,
        x: 0,
        y: 0,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile('index.html');
}
electron_1.app.whenReady().then(() => {
    createWindow();
});
