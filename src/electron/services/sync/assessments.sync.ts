import { AssessmentsOffline } from "../offline/assessments.offline";
import { AssessmentsOnline } from "../online/assessments.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";

export class AssessmentsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('assessments');
        const rows = await AssessmentsOnline.fetchSince(lastSynced);
        if (rows.length) {
            AssessmentsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'assessments',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ assessments pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('assessments');
        const rows = AssessmentsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await AssessmentsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'assessments',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ assessments pushed');
    }
}
