// sync/SyncMeta.ts
import { LocalDatabase } from "../sqlite/Database";

export class SyncMeta {
    static getLastSynced(table: string): string {
        const row = new LocalDatabase().getConnection()
            .prepare('SELECT last_synced FROM sync_meta WHERE table_name = ?')
            .get(table);

        return row.last_synced || '1970-01-01T00:00:00Z';
    }

    static updateLastSynced(table: string, timestamp: string) {
        new LocalDatabase().getConnection()
            .prepare(`
        INSERT INTO sync_meta (table_name, last_synced)
        VALUES (?, ?)
        ON CONFLICT(table_name) DO UPDATE
        SET last_synced = excluded.last_synced
      `)
            .run(table, timestamp);
    }

    static getLastPushed(table: string): string {
        const row = new LocalDatabase().getConnection()
            .prepare('SELECT last_synced_to_server FROM sync_meta WHERE table_name = ?')
            .get(table);

        return row.last_synced_to_server || '1970-01-01T00:00:00Z';
    }

    static updateLastPushed(table: string, timestamp: string) {
        new LocalDatabase().getConnection()
            .prepare(`
        INSERT INTO sync_meta (table_name, last_synced_to_server)
        VALUES (?, ?)
        ON CONFLICT(table_name) DO UPDATE
        SET last_synced_to_server = excluded.last_synced_to_server
      `).run(table, timestamp);
    }
}
