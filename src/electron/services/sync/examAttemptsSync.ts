import { ExamAttemptsOffline } from "../offline/examAttempts.offline";
import { ExamAttemptsOnline } from "../online/examAttempts.online";
import { SyncMeta } from "./syncMeta";


export class ExamAttemptsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('exam_attempts');
        const rows = await ExamAttemptsOnline.fetchSince(lastSynced);
        if (rows.length) {
            ExamAttemptsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('exam_attempts', latest);
        }
        console.log('✔ exam_attempts pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('exam_attempts');
        const rows = ExamAttemptsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await ExamAttemptsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('exam_attempts', latest);
        }
        console.log('✔ exam_attempts pushed');
    }
}
