import { CourseAssignmentsOffline } from "../offline/courseAssignments.offline";
import { CourseAssignmentsOnline } from "../online/courseAssignment.sonline";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class CourseAssignmentsSync {
    static async pullOnlineToOffline() {
        let lastSynced = Sync.getLastSynced("course_assignments");

        if (lastSynced) {
            lastSynced = dayjs.utc(lastSynced).toISOString();
        }

        const rows = await CourseAssignmentsOnline.fetchSince(lastSynced);

        if (rows.length) {
            const cleanedRows = rows.map(row => ({
                ...row,
                updatedAt: dayjs.utc(row.updatedAt!).toISOString(),
            }));

            CourseAssignmentsOffline.save(cleanedRows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastSynced || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "course_assignments",
                lastSynced: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastSynced(payload);
        }

        console.log("✔ course_assignments pulled");
    }

    static async pushOfflineToOnline() {
        let lastPushed = Sync.getLastPushed("course_assignments");

        if (lastPushed) {
            lastPushed = dayjs.utc(lastPushed).toISOString();
        }

        const changedRows = CourseAssignmentsOffline.getUpdatedSince(lastPushed);

        if (changedRows.length) {
            await CourseAssignmentsOnline.upsert(changedRows);

            const latest = changedRows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastPushed || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "course_assignments",
                lastSyncedToServer: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastPushed(payload);
        }

        console.log("✔ course_assignments pushed");
    }
}
