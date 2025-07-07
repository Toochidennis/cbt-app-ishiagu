import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util/util';
import { getPreloadPath } from './util/pathResolver';
import { LocalDatabase } from './services/sqlite/Database';
//import { seedSettings } from './services/sqlite/seed/seed';

let mainWindow: BrowserWindow;
let db: LocalDatabase

app.on('ready', () => {
    db = new LocalDatabase();

    //seedSettings(db.getConnection());

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