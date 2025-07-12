import { DB } from './db.offline';
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import type { Grade } from '../sqlite/models';

export class GradesOffline {
    static save(rows: Grade[]) {
        const db = DB.getConnection();

        const stmt = db.prepare(`
            INSERT INTO grades (
                id,
                name,
                min_score,
                max_score,
                remark,
                created_at,
                updated_at
            ) VALUES (
                @id,
                @name,
                @min_score,
                @max_score,
                @remark,
                @created_at,
                @updated_at
            )
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                min_score = excluded.min_score,
                max_score = excluded.max_score,
                remark = excluded.remark,
                created_at = excluded.created_at,
                updated_at = excluded.updated_at;
        `);

        const txn = db.transaction((grades: Grade[]) => {
            for (const row of grades) {
                stmt.run(appToDb(row));
            }
        });

        txn(rows);
    }

    static getUpdatedSince(lastSynced: string): Grade[] {
        const rows = DB.getConnection()
            .prepare(`SELECT * FROM grades WHERE updated_at > ?`)
            .all(lastSynced) as Record<string, any>[];

        if (!rows || rows.length === 0) return [];

        return rows.map((row) => dbToApp<Grade>(row));
    }
}
