import { CourseAssignmentsOffline } from "../offline/courseAssignments.offline";
import { CourseAssignmentsOnline } from "../online/courseAssignment.sonline";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";


export class CourseAssignmentsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('course_assignments');
        const rows = await CourseAssignmentsOnline.fetchSince(lastSynced);
        if (rows.length) {
            CourseAssignmentsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'course_assignments',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ course_assignments pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('course_assignments');
        const changedRows = CourseAssignmentsOffline.getUpdatedSince(lastPushed);
        if (changedRows.length) {
            await CourseAssignmentsOnline.upsert(changedRows);
            const latest = changedRows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'course_assignments',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ course_assignments pushed');
    }
}
