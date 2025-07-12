import { GradesOffline } from "../offline/grade.offline";
import { GradesOnline } from "../online/grades.online";
import { Sync } from "./sync.sync";


export class GradesSync {
    static tableName = "grades";

    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced(this.tableName);
        const rows = await GradesOnline.fetchSince(lastSynced);

        if (rows.length) {
            GradesOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            Sync.updateLastSynced({
                tableName: this.tableName,
                lastSynced: latest
            });
        }

        console.log("✔ grades pulled");
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed(this.tableName);
        const rows = GradesOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            await GradesOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );

            Sync.updateLastPushed({
                tableName: this.tableName,
                lastSyncedToServer: latest
            });
        }

        console.log("✔ grades pushed");
    }
}
