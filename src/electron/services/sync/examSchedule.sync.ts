import { ExamSchedulesOffline } from "../offline/examSchedules.offline";
import { ExamSchedulesOnline } from "../online/examSchedules.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";


export class ExamSchedulesSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('exam_schedules');
        const rows = await ExamSchedulesOnline.fetchSince(lastSynced);
        if (rows.length) {
            ExamSchedulesOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'exam_schedules',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ exam_schedules pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('exam_schedules');
        const rows = ExamSchedulesOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await ExamSchedulesOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'exam_schedules',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ exam_schedules pushed');
    }
}
