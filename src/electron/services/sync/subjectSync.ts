import { SubjectsOffline } from "../offline/subjects.offline";
import { SubjectsOnline } from "../online/subjects.online";
import { SyncMeta } from "./syncMeta";

export class SubjectsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('subjects');
        const rows = await SubjectsOnline.fetchSince(lastSynced);
        if (rows.length) {
            SubjectsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('subjects', latest);
        }
        console.log('✔ subjects pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('subjects');
        const changedRows = SubjectsOffline.getUpdatedSince(lastPushed);
        if (changedRows.length) {
            await SubjectsOnline.upsert(changedRows);
            const latest = changedRows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('subjects', latest);
        }
        console.log('✔ subjects pushed');
    }
}
