import { CourseRegistrationsOffline } from "../offline/courseRegistrations.offline";
import { CourseRegistrationsOnline } from "../online/courseRegistrations.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class CourseRegistrationsSync {
    static async pullOnlineToOffline() {
        let lastSynced = Sync.getLastSynced("course_registrations");

        if (lastSynced) {
            lastSynced = dayjs.utc(lastSynced).toISOString();
        }

        const rows = await CourseRegistrationsOnline.fetchSince(lastSynced);

        if (rows.length) {
            const cleanedRows = rows.map(row => ({
                ...row,
                updatedAt: dayjs.utc(row.updatedAt!).toISOString(),
            }));

            CourseRegistrationsOffline.save(cleanedRows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastSynced || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "course_registrations",
                lastSynced: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastSynced(payload);
        }

        console.log("✔ course_registrations pulled");
    }

    static async pushOfflineToOnline() {
        let lastPushed = Sync.getLastPushed("course_registrations");

        if (lastPushed) {
            lastPushed = dayjs.utc(lastPushed).toISOString();
        }

        const rows = CourseRegistrationsOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            await CourseRegistrationsOnline.upsert(rows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastPushed || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "course_registrations",
                lastSyncedToServer: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastPushed(payload);
        }

        console.log("✔ course_registrations pushed");
    }
}
