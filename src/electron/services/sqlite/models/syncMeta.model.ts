export class SyncMeta {
    tableName!: string;
    lastSynced?: string;
    lastSyncedToServer?: string;

    constructor(init?: Partial<SyncMeta>) {
        Object.assign(this, init);
    }
}