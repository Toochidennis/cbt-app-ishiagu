import type { IpcChannels } from '@/types/ipc/ipcTypes';

declare global {
    interface Window {
        api: {
            invoke<T extends keyof IpcChannels>(
                channel: T,
                args?: IpcChannels[T]['input']
            ): Promise<IpcChannels[T]['result']>;
        };
    }
}
