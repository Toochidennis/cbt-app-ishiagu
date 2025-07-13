import { AssessmentsOffline } from "../offline/assessments.offline";
import { AssessmentsOnline } from "../online/assessments.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class AssessmentsSync {
    static async pullOnlineToOffline() {
        let lastSynced = Sync.getLastSynced("assessments");

        if (lastSynced) {
            lastSynced = dayjs.utc(lastSynced).toISOString(); // normalize to UTC
        }

        const rows = await AssessmentsOnline.fetchSince(lastSynced);

        if (rows.length) {
            const cleanedRows = rows.map(row => ({
                ...row,
                updatedAt: dayjs.utc(row.updatedAt!).toISOString(),
            }));

            AssessmentsOffline.save(cleanedRows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastSynced || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "assessments",
                lastSynced: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastSynced(payload);
        }

        console.log("✔ assessments pulled");
    }

    static async pushOfflineToOnline() {
        let lastPushed = Sync.getLastPushed("assessments");

        if (lastPushed) {
            lastPushed = dayjs.utc(lastPushed).toISOString();
        }

        const rows = AssessmentsOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            await AssessmentsOnline.upsert(rows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastPushed || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "assessments",
                lastSyncedToServer: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastPushed(payload);
        }

        console.log("✔ assessments pushed");
    }
}
