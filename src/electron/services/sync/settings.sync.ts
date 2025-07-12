import { SettingsOffline } from "../offline/settings.offline";
import { SettingsOnline } from "../online/settings.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";


export class SettingsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('settings');
        const rows = await SettingsOnline.fetchSince(lastSynced);
        if (rows.length) {
            SettingsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'settings',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ settings pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('settings');
        const rows = SettingsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await SettingsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'settings',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ settings pushed');
    }
}
