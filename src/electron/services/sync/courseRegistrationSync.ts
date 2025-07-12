import { CourseRegistrationsOffline } from "../offline/courseRegistrations.offline";
import { CourseRegistrationsOnline } from "../online/courseRegistrations.online";
import { SyncMeta } from "./syncMeta";

export class CourseRegistrationsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('course_registrations');
        const rows = await CourseRegistrationsOnline.fetchSince(lastSynced);
        if (rows.length) {
            CourseRegistrationsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('course_registrations', latest);
        }
        console.log('✔ course_registrations pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('course_registrations');
        const rows = CourseRegistrationsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await CourseRegistrationsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('course_registrations', latest);
        }
        console.log('✔ course_registrations pushed');
    }
}
