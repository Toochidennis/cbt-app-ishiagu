import { QuestionsOffline } from "../offline/questions.offline";
import { QuestionsOnline } from "../online/questions.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class QuestionsSync {
    static tableName = "questions";

    static async pullOnlineToOffline() {
        let lastSynced = Sync.getLastSynced(this.tableName);

        if (lastSynced) {
            lastSynced = dayjs.utc(lastSynced).toISOString();
        }

        const rows = await QuestionsOnline.fetchSince(lastSynced);

        if (rows.length) {
            const cleanedRows = rows.map(row => ({
                ...row,
                updatedAt: dayjs.utc(row.updatedAt!).toISOString(),
            }));

            QuestionsOffline.save(cleanedRows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastSynced || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: this.tableName,
                lastSynced: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastSynced(payload);
        }

        console.log("✔ questions pulled");
    }

    static async pushOfflineToOnline() {
        let lastPushed = Sync.getLastPushed(this.tableName);

        if (lastPushed) {
            lastPushed = dayjs.utc(lastPushed).toISOString();
        }

        const rows = QuestionsOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            await QuestionsOnline.upsert(rows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastPushed || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: this.tableName,
                lastSyncedToServer: dayjs.utc(latest).toISOString(),
            };

            Sync.updateLastPushed(payload);
        }

        console.log("✔ questions pushed");
    }
}
