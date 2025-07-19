import { ExamAttemptsOffline } from "../offline/examAttempts.offline";
import { ExamAttemptsOnline } from "../online/examAttempts.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class ExamAttemptsSync {
    static async pullOnlineToOffline() {
        let lastSynced = Sync.getLastSynced("exam_attempts");
        console.log('last sync online ', lastSynced);

        if (lastSynced) {
            lastSynced = dayjs.utc(lastSynced).toISOString();
        }

        const rows = await ExamAttemptsOnline.fetchSince(lastSynced);

        if (rows.length) {
            const cleanedRows = rows.map(row => ({
                ...row,
                updatedAt: dayjs.utc(row.updatedAt!).toISOString(),
            }));

            ExamAttemptsOffline.save(cleanedRows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastSynced || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "exam_attempts",
                lastSynced: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastSynced(payload);
        }

        console.log("✔ exam_attempts pulled");
    }

    static async pushOfflineToOnline() {
        let lastPushed = Sync.getLastPushed("exam_attempts");
        console.log('last pushed ', lastPushed);

        if (lastPushed) {
            lastPushed = dayjs.utc(lastPushed).toISOString();
        }

        const rows = ExamAttemptsOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            await ExamAttemptsOnline.upsert(rows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastPushed || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "exam_attempts",
                lastSyncedToServer: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastPushed(payload);
        }

        console.log("✔ exam_attempts pushed");
    }
}
