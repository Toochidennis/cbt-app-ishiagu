import { DB } from './db.offline';
import { appToDb } from "../../../electron/util/caseTransform";
import type { Subject } from '../sqlite/models';

export class SubjectsOffline {
    static save(rows: Subject[]) {
        const db = DB.getConnection();

        const stmt = db.prepare(`
        INSERT INTO subjects (
          id,
          code,
          name,
          created_at,
          updated_at
        ) VALUES (
          @id,
          @code,
          @name,
          @created_at,
          @updated_at
        )
        ON CONFLICT(id) DO UPDATE SET
          code = excluded.code,
          name = excluded.name,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at;
    `);

        const txn = db.transaction((subjects: Subject[]) => {
            for (const row of subjects) {
                stmt.run(appToDb(row));
            }
        });

        txn(rows);
    }

    static getUpdatedSince(lastSynced: string) {
        return DB.getConnection()
            .prepare(`SELECT * FROM subjects WHERE updated_at > ?`)
            .all(lastSynced);
    }
}
