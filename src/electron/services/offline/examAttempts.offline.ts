import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import type { ExamAttempt } from "../sqlite/models";
import { DB } from "./db.offline";

export class ExamAttemptsOffline {
  static save(rows: ExamAttempt[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
          INSERT INTO exam_attempts (
            id,
            exam_schedule_id,
            student_id,
            status,
            created_at,
            updated_at
          )
          VALUES (
            @id,
            @exam_schedule_id,
            @student_id,
            @status,
            @created_at,
            @updated_at
          )
          ON CONFLICT(exam_schedule_id, student_id) DO UPDATE SET
            status = excluded.status,
            created_at = excluded.created_at,
            updated_at = excluded.updated_at;
    `);

    const txn = db.transaction((attempts: ExamAttempt[]) => {
      for (const row of attempts) {
        stmt.run(appToDb(row));
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string): ExamAttempt[] {
    const rows = DB.getConnection()
      .prepare(`SELECT * FROM exam_attempts WHERE updated_at > ?`)
      .all(lastSynced) as Record<string, any>[];

    if (!rows) return [];

    return rows.map((row) => dbToApp<ExamAttempt>(row))
  }
}
