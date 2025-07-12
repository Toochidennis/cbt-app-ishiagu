import type { ExamSchedule } from "../sqlite/models";
import { DB } from "./db.offline";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";

export class ExamSchedulesOffline {
  static save(rows: ExamSchedule[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
        INSERT INTO exam_schedules (
          id,
          description,
          subject_id,
          class_id,
          exam_date,
          time,
          duration_minutes,
          year,
          term,
          created_by,
          created_at,
          updated_at
        )
        VALUES (
          @id,
          @description,
          @subject_id,
          @class_id,
          @exam_date,
          @time,
          @duration_minutes,
          @year,
          @term,
          @created_by,
          @created_at,
          @updated_at
        )
        ON CONFLICT(subject_id, class_id, term, year) DO UPDATE SET
          description = excluded.description,
          exam_date = excluded.exam_date,
          time = excluded.time,
          duration_minutes = excluded.duration_minutes,
          year = excluded.year,
          term = excluded.term,
          created_by = excluded.created_by,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at;
    `);

    const txn = db.transaction((schedules: ExamSchedule[]) => {
      for (const row of schedules) {
        stmt.run(appToDb(row));
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string): ExamSchedule[] {
    const rows = DB.getConnection()
      .prepare(`SELECT * FROM exam_schedules WHERE updated_at > ?`)
      .all(lastSynced) as Record<string, any>[];

    if (!rows) return [];

    return rows.map((row) => dbToApp<ExamSchedule>(row))
  }
}
