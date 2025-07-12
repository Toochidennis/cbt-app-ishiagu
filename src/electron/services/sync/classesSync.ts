import { ClassesOffline } from "../offline/classes.offline";
import { ClassesOnline } from "../online/classes.online";
import { SyncMeta } from "./syncMeta";

export class ClassesSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('classes');
        const rows = await ClassesOnline.fetchSince(lastSynced);
        if (rows.length) {
            ClassesOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('classes', latest);
        }
        console.log('✔ classes pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('classes');
        const rows = ClassesOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await ClassesOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('classes', latest);
        }
        console.log('✔ classes pushed');
    }
}
