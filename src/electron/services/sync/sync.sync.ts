import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { DB } from "../offline/db.offline";
import { SyncMeta } from "../sqlite/models";

export class Sync {

    private static getSyncField(
        table: string,
        column: keyof SyncMeta,
        defaultValue = '1970-01-01T00:00:00Z'
    ): string {

        const columnMap: Record<keyof SyncMeta, string> = {
            tableName: 'table_name',
            lastSynced: 'last_synced',
            lastSyncedToServer: "last_synced_to_server"
        };

        const sqlColumn = columnMap[column];

        const row = DB.getConnection()
            .prepare(`SELECT ${sqlColumn} FROM sync_meta WHERE table_name = @table`)
            .get({ table });

        if (!row) return defaultValue;

        const data = dbToApp<SyncMeta>(row);
        console.log('Sync meta ', data);
        return data[column] || defaultValue;
    }

    static getLastSynced(table: string): string {
        return Sync.getSyncField(table, 'lastSynced');
    }

    static updateLastSynced(syncMeta: SyncMeta) {
        DB.getConnection()
            .prepare(`
            INSERT INTO sync_meta (table_name, last_synced)
            VALUES (@table_name, @last_synced)
            ON CONFLICT(table_name) DO UPDATE
            SET last_synced = excluded.last_synced
        `).run(appToDb(syncMeta));
    }

    static getLastPushed(table: string): string {
        return Sync.getSyncField(table, 'lastSyncedToServer');
    }

    static updateLastPushed(syncMeta: SyncMeta) {
        DB.getConnection()
            .prepare(`
            INSERT INTO sync_meta (table_name, last_synced_to_server)
            VALUES (@table_name, @last_synced_to_server)
            ON CONFLICT(table_name) DO UPDATE
            SET last_synced_to_server = excluded.last_synced_to_server
        `).run(appToDb(syncMeta));
    }
}
