import { ResultsOffline } from "../offline/results.offline";
import { ResultsOnline } from "../online/results.online";
import { SyncMeta } from "./syncMeta";

export class ResultsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('results');

        const rows = await ResultsOnline.fetchSince(lastSynced);

        if (rows.length) {
            ResultsOffline.save(rows);

            const newest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );

            SyncMeta.updateLastSynced('results', newest);
        }

        console.log('✔ results pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('results');

        const changedRows = ResultsOffline.getUpdatedSince(lastPushed);

        if (changedRows.length) {
            await ResultsOnline.upsert(changedRows);

            const newest = changedRows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );

            SyncMeta.updateLastPushed('results', newest);
        }

        console.log('✔ results pushed');
    }
}
