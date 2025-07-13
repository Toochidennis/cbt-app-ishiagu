import { ExamSchedulesOffline } from "../offline/examSchedules.offline";
import { ExamSchedulesOnline } from "../online/examSchedules.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class ExamSchedulesSync {
    static async pullOnlineToOffline() {
        let lastSynced = Sync.getLastSynced("exam_schedules");

        if (lastSynced) {
            lastSynced = dayjs.utc(lastSynced).toISOString();
        }

        const rows = await ExamSchedulesOnline.fetchSince(lastSynced);

        if (rows.length) {
            const cleanedRows = rows.map(row => ({
                ...row,
                updatedAt: dayjs.utc(row.updatedAt!).toISOString(),
            }));

            ExamSchedulesOffline.save(cleanedRows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastSynced || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "exam_schedules",
                lastSynced: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastSynced(payload);
        }

        console.log("✔ exam_schedules pulled");
    }

    static async pushOfflineToOnline() {
        let lastPushed = Sync.getLastPushed("exam_schedules");

        if (lastPushed) {
            lastPushed = dayjs.utc(lastPushed).toISOString();
        }

        const rows = ExamSchedulesOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            await ExamSchedulesOnline.upsert(rows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastPushed || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "exam_schedules",
                lastSyncedToServer: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastPushed(payload);
        }

        console.log("✔ exam_schedules pushed");
    }
}
