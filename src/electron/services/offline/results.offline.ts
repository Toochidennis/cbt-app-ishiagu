import { DB } from "./db.offline";
import { appToDb } from "../../../electron/util/caseTransform";
import type { Result } from "../sqlite/models";

export class ResultsOffline {
  static save(rows: Result[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
      INSERT INTO results (
        id,
        student_id,
        subject_id,
        class_id,
        term,
        year,
        ca1,
        ca2,
        exam,
        total_score,
        grade,
        remarks,
        approved,
        approved_at,
        created_at,
        updated_at
      ) VALUES (
        @id,
        @student_id,
        @subject_id,
        @class_id,
        @term,
        @year,
        @ca1,
        @ca2,
        @exam,
        @total_score,
        @grade,
        @remarks,
        @approved,
        @approved_at,
        @created_at,
        @updated_at
      )
      ON CONFLICT(student_id, subject_id, class_id, term, year)
      DO UPDATE SET
        ca1 = excluded.ca1,
        ca2 = excluded.ca2,
        exam = excluded.exam,
        total_score = excluded.total_score,
        grade = excluded.grade,
        remarks = excluded.remarks,
        approved = excluded.approved,
        approved_at = excluded.approved_at,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at;
    `);

    const txn = db.transaction((results: Result[]) => {
      for (const row of results) {
        stmt.run(appToDb(row));
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string) {
    const db = DB.getConnection();
    return db
      .prepare(`
        SELECT * FROM results
        WHERE updated_at > ?
      `)
      .all(lastSynced);
  }
}
