import { appToDb, dbToApp } from "../../util/caseTransform";
import { Assessment } from "../sqlite/models";
import { DB } from "./db.offline";

export class AssessmentsOffline {
  static save(rows: Assessment[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
      INSERT INTO assessments (
        id,
        subject_id,
        class_id,
        assessment_name,
        max_score,
        created_at,
        updated_at
      )
      VALUES (
        @id,
        @subject_id,
        @class_id,
        @assessment_name,
        @max_score,
        @created_at,
        @updated_at
      )
      ON CONFLICT(subject_id, class_id, assessment_name) DO UPDATE SET
        max_score = excluded.max_score,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at;
    `);

    const txn = db.transaction((assessments: Assessment[]) => {
      for (const row of assessments) {
        stmt.run(appToDb(row));
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string): Assessment[] {
    const rows = DB.getConnection()
      .prepare(`SELECT * FROM assessments WHERE updated_at > ?`)
      .all(lastSynced) as Record<string, any>[];

    if (!rows) return [];

    return rows.map((row) => dbToApp<Assessment>(row))
  }
}
