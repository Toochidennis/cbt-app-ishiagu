import { CourseRegistrationsOffline } from "../offline/courseRegistrations.offline";
import { CourseRegistrationsOnline } from "../online/courseRegistrations.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";

export class CourseRegistrationsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('course_registrations');
        const rows = await CourseRegistrationsOnline.fetchSince(lastSynced);
        if (rows.length) {
            CourseRegistrationsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'course_registrations',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ course_registrations pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('course_registrations');
        const rows = CourseRegistrationsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await CourseRegistrationsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'course_registrations',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ course_registrations pushed');
    }
}
