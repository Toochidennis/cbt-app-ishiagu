import { appToDb } from "../../util/caseTransform";
import type { Assessment } from "../sqlite/models";
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
        const dbRow = appToDb(row);
        stmt.run(dbRow);
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string) {
    return DB.getConnection()
      .prepare(`SELECT * FROM assessments WHERE updated_at > ?`)
      .all(lastSynced);
  }
}
