import { ExamSchedulesOffline } from "../offline/examSchedules.offline";
import { ExamSchedulesOnline } from "../online/examSchedules.online";
import { SyncMeta } from "./syncMeta";


export class ExamSchedulesSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('exam_schedules');
        const rows = await ExamSchedulesOnline.fetchSince(lastSynced);
        if (rows.length) {
            ExamSchedulesOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('exam_schedules', latest);
        }
        console.log('✔ exam_schedules pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('exam_schedules');
        const rows = ExamSchedulesOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await ExamSchedulesOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('exam_schedules', latest);
        }
        console.log('✔ exam_schedules pushed');
    }
}
