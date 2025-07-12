import type { Setting } from "../sqlite/models";
import { DB } from "./db.offline";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";

export class SettingsOffline {
  static save(rows: Setting[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
        INSERT INTO settings (
          id,
          school_name,
          logo,
          term,
          year,
          created_at,
          updated_at
        )
        VALUES (
          @id,
          @school_name,
          @logo,
          @term,
          @year,
          @created_at,
          @updated_at
        )
        ON CONFLICT(id) DO UPDATE SET
          school_name = excluded.school_name,
          logo = excluded.logo,
          term = excluded.term,
          year = excluded.year,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at;
    `);

    const txn = db.transaction((settings: Setting[]) => {
      for (const row of settings) {
        stmt.run(appToDb(row));
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string): Setting[] {
    const rows = DB.getConnection()
      .prepare(`SELECT * FROM settings WHERE updated_at > ?`)
      .all(lastSynced) as Record<string, any>[];

    if (!rows) return [];

    return rows.map((row) => dbToApp<Setting>(row))
  }
}
