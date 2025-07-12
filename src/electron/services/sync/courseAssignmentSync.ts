import { CourseAssignmentsOffline } from "../offline/courseAssignments.offline";
import { CourseAssignmentsOnline } from "../online/courseAssignment.sonline";
import { SyncMeta } from "./syncMeta";


export class CourseAssignmentsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('course_assignments');
        const rows = await CourseAssignmentsOnline.fetchSince(lastSynced);
        if (rows.length) {
            CourseAssignmentsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('course_assignments', latest);
        }
        console.log('✔ course_assignments pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('course_assignments');
        const changedRows = CourseAssignmentsOffline.getUpdatedSince(lastPushed);
        if (changedRows.length) {
            await CourseAssignmentsOnline.upsert(changedRows);
            const latest = changedRows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('course_assignments', latest);
        }
        console.log('✔ course_assignments pushed');
    }
}
