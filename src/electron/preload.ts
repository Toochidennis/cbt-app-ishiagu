const { ipcRenderer, contextBridge } = require( "electron");
import { type IpcChannels } from "../types/ipc/ipcTypes";

const api = {
    invoke: <T extends keyof IpcChannels>(
        channel: T,
        args: IpcChannels[T]['input']
    ): Promise<IpcChannels[T]['result']> => {
        return ipcRenderer.invoke(channel, args);
    }
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
