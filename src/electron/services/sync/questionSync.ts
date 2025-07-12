import { QuestionsOffline } from "../offline/questions.offline";
import { QuestionsOnline } from "../online/questions.online";
import { SyncMeta } from "./syncMeta";


export class QuestionsSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('questions');
        const rows = await QuestionsOnline.fetchSince(lastSynced);
        if (rows.length) {
            QuestionsOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('questions', latest);
        }
        console.log('✔ questions pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('questions');
        const rows = QuestionsOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await QuestionsOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('questions', latest);
        }
        console.log('✔ questions pushed');
    }
}
