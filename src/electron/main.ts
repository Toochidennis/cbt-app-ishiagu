import { app } from 'electron';
import { MainApp } from './mainApp'

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    const mainApp = new MainApp();

    app.on('ready', () => {
        mainApp.init();
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });

    app.on('activate', () => {
        mainApp.activate();
    });

    app.on('second-instance', () => {
        mainApp.focusWindow();
    });
}
