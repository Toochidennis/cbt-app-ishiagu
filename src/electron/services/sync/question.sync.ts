import { QuestionsOffline } from "../offline/questions.offline";
import { QuestionsOnline } from "../online/questions.online";
import type { SyncMeta } from "../sqlite/models";
import { Sync } from "./sync.sync";


export class QuestionsSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('questions');
        const rows = await QuestionsOnline.fetchSince(lastSynced);
        if (rows.length) {
            QuestionsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'questions',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ questions pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('questions');
        const rows = QuestionsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await QuestionsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            
            Sync.updateLastPushed({
                tableName: 'questions',
                lastSyncedToServer: latest
            });
        }
        console.log('✔ questions pushed');
    }
}
