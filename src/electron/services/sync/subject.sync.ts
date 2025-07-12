import { SubjectsOffline } from "../offline/subjects.offline";
import { SubjectsOnline } from "../online/subjects.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";

export class SubjectsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('subjects');
        const rows = await SubjectsOnline.fetchSince(lastSynced);
        if (rows.length) {
            SubjectsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'subjects',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ subjects pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('subjects');
        const rows = SubjectsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await SubjectsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'subjects',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ subjects pushed');
    }
}
