import { Class } from '../sqlite/models';
import { DB } from './db.offline'
import { appToDb, dbToApp } from "../../util/caseTransform";

export class ClassesOffline {
  static save(rows: Class[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
          INSERT INTO classes (
            id, name, form_teacher,
            created_at, updated_at
          )
          VALUES (
            @id, @name, @form_teacher,
            @created_at, @updated_at
          )
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            form_teacher = excluded.form_teacher,
            created_at = excluded.created_at,
            updated_at = excluded.updated_at;
    `);

    const txn = db.transaction((classes: Class[]) => {
      for (const row of classes) {
        const dbRow = appToDb(row);
        stmt.run(dbRow);
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string): Class[] {
    const rows = DB.getConnection()
      .prepare(`SELECT * FROM classes WHERE updated_at > ?`)
      .all(lastSynced) as Record<string, any>[];

    if (!rows) return [];

    return rows.map((row) => dbToApp<Class>(row))
  }
}
