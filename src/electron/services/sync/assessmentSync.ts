import { AssessmentsOffline } from "../offline/assessments.offline";
import { AssessmentsOnline } from "../online/assessments.online";
import { SyncMeta } from "./syncMeta";


export class AssessmentsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('assessments');
        const rows = await AssessmentsOnline.fetchSince(lastSynced);
        if (rows.length) {
            AssessmentsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('assessments', latest);
        }
        console.log('✔ assessments pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('assessments');
        const rows = AssessmentsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await AssessmentsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('assessments', latest);
        }
        console.log('✔ assessments pushed');
    }
}
