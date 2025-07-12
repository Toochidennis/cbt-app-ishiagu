import { SettingsOffline } from "../offline/settings.offline";
import { SettingsOnline } from "../online/settings.online";
import { SyncMeta } from "./syncMeta";


export class SettingsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('settings');
        const rows = await SettingsOnline.fetchSince(lastSynced);
        if (rows.length) {
            SettingsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('settings', latest);
        }
        console.log('✔ settings pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('settings');
        const rows = SettingsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await SettingsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('settings', latest);
        }
        console.log('✔ settings pushed');
    }
}
