import { ClassesOffline } from "../offline/classes.offline";
import { ClassesOnline } from "../online/classes.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";

export class ClassesSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('classes');
        const rows = await ClassesOnline.fetchSince(lastSynced);
        if (rows.length) {
            ClassesOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'classes',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ classes pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('classes');
        const rows = ClassesOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await ClassesOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'classes',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ classes pushed');
    }
}
