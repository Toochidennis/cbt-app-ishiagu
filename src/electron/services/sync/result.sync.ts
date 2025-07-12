import { ResultsOffline } from "../offline/results.offline";
import { ResultsOnline } from "../online/results.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";

export class ResultsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('results');
        const rows = await ResultsOnline.fetchSince(lastSynced);

        if (rows.length) {
            ResultsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'results',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }

        console.log('✔ results pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('results');
        const rows = ResultsOffline.getUpdatedSince(lastPushed);

        if (rows.length) {
            await ResultsOnline.upsert(rows);

            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'results',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }

        console.log('✔ results pushed');
    }
}
