import { app, BrowserWindow } from 'electron';
import { getPreloadPath } from './util/pathResolver';
import path from 'path';
import { isDev } from './util/util';

export class WindowManager {
    private mainWindow?: BrowserWindow;

    public createWindow() {
        this.mainWindow = new BrowserWindow({
            webPreferences: {
                contextIsolation: true,
                preload: getPreloadPath(),
                nodeIntegration: false,
            }
        });

        this.mainWindow.setMenu(null);
        this.mainWindow.maximize();

        if (isDev()) {
            this.mainWindow.loadURL('http://localhost:5123');
            this.mainWindow.webContents.openDevTools();
        } else {
            this.mainWindow.loadFile(
                path.join(app.getAppPath(), '/dist-react/index.html')
            );
        }
    }

    public hasWindow(): boolean {
        return !!this.mainWindow;
    }

    public focus() {
        if (this.mainWindow) {
            if (this.mainWindow.isMinimized()) {
                this.mainWindow.restore();
            }
            this.mainWindow.show();
            this.mainWindow.focus();
        }
    }
}
