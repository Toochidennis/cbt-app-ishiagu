import { ipcMain, type WebContents } from "electron";

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

function ipcHandle<Key extends string>(
    key: Key,
    handler: () => any
) {
    ipcMain.handle(key, () => handler());
}

function ipcWebContentsSend<Key extends string>(
    key: Key,
    webContents: WebContents,
    payload: any
) {
    webContents.send(key, payload);
}