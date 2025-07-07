import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util';
import { getPreloadPath } from './pathResolver';
import { LocalDatabase } from './services/sqlite/Database';

let mainWindow: BrowserWindow;
let db: LocalDatabase

app.on('ready', () => {
    console.log(app.getAppPath()); 
    db = new LocalDatabase();

    mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation: true,
            preload: getPreloadPath(),
            nodeIntegration: false,
        }
    });

    mainWindow.setMenu(null);
    mainWindow.maximize();

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123')
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
});