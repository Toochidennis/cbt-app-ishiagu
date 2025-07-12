import { UsersOnline } from "../online/users.online";
import { UsersOffline } from "../offline/users.offline";
import { Sync } from "./sync.sync";
import type { SyncMeta } from "../sqlite/models";

export class UsersSync {
    static async pullOnlineToOffline() {
        const lastSynced = Sync.getLastSynced('users');
        const rows = await UsersOnline.fetchSince(lastSynced);
        if (rows.length) {
            UsersOffline.save(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastSynced
            );

            const payload: SyncMeta = {
                tableName: 'users',
                lastSynced: latest
            }
            Sync.updateLastSynced(payload);
        }
        console.log('✔ users pulled');
    }

    static async pushOfflineToOnline() {
        const lastPushed = Sync.getLastPushed('users');
        const rows = UsersOffline.getUpdatedSince(lastPushed);
        if (rows.length) {
            await UsersOnline.upsert(rows);
            const latest = rows.reduce(
                (max, r) => (r.updatedAt! > max ? r.updatedAt! : max),
                lastPushed
            );
            const payload: SyncMeta = {
                tableName: 'users',
                lastSyncedToServer: latest
            }
            Sync.updateLastPushed(payload);
        }
        console.log('✔ users pushed');
    }
}
