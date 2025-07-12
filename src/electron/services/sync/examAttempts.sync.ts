import { ExamAttemptsOffline } from "../offline/examAttempts.offline";
import { ExamAttemptsOnline } from "../online/examAttempts.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";


export class ExamAttemptsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('exam_attempts');
        const rows = await ExamAttemptsOnline.fetchSince(lastSynced);
        if (rows.length) {
            ExamAttemptsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'exam_attempts',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ exam_attempts pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('exam_attempts');
        const rows = ExamAttemptsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await ExamAttemptsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'exam_attempts',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ exam_attempts pushed');
    }
}
