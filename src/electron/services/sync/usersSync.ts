import { UsersOnline } from "../online/user.online";
import { UsersOffline } from "../offline/users.offline";
import { SyncMeta } from "./syncMeta";

export class UsersSync {
    static async pullOnlineToOffline() {
        const lastSynced = SyncMeta.getLastSynced('users');
        const rows = await UsersOnline.fetchSince(lastSynced);
        if (rows.length) {
            UsersOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastSynced
            );
            SyncMeta.updateLastSynced('users', latest);
        }
        console.log('✔ users pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = SyncMeta.getLastPushed('users');
        const changed = UsersOffline.getUpdatedSince(lastPushed);
        if (changed.length) {
            await UsersOnline.upsert(changed);
            const latest = changed.reduce(
                (max, r) => (r.updated_at > max ? r.updated_at : max),
                lastPushed
            );
            SyncMeta.updateLastPushed('users', latest);
        }
        console.log('✔ users pushed');
    }
}
