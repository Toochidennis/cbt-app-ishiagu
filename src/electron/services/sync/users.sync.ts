import { UsersOnline } from "../online/users.online";
import { UsersOffline } from "../offline/users.offline";
import { Sync } from "./sync.sync";
import type { SyncMeta } from "../sqlite/models";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class UsersSync {
    static async pullOnlineToOffline() {
        let lastSynced = Sync.getLastSynced("users");

        if (lastSynced) {
            lastSynced = dayjs.utc(lastSynced).toISOString(); // standardized format
        }

        const rows = await UsersOnline.fetchSince(lastSynced);

        if (rows.length) {
            const cleanedRows = rows.map(row => ({
                ...row,
                updatedAt: dayjs.utc(row.updatedAt!).toISOString(), // store as UTC ISO string
            }));

            UsersOffline.save(cleanedRows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastSynced || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "users",
                lastSynced: dayjs.utc(latest).toISOString(), // persist as ISO UTC
            };

            Sync.updateLastSynced(payload);
        }

        console.log("✔ users pulled");
    }

    static async pushOfflineToOnline() {
        let lastPushed = Sync.getLastPushed("users");

        if (lastPushed) {
            lastPushed = dayjs.utc(lastPushed).toISOString(); // consistent format
        }

        const rows = UsersOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            // It's assumed the rows already have valid `updatedAt` ISO strings
            await UsersOnline.upsert(rows);

            const latest = rows.reduce(
                (max, r) =>
                    dayjs.utc(r.updatedAt!).isAfter(dayjs.utc(max))
                        ? r.updatedAt!
                        : max,
                lastPushed || "1970-01-01T00:00:00.000Z"
            );

            const payload: SyncMeta = {
                tableName: "users",
                lastSyncedToServer: dayjs.utc(latest).toISOString(), // persist clean
            };

            Sync.updateLastPushed(payload);
        }

        console.log("✔ users pushed");
    }
}
