import type { CourseAssignment } from "../sqlite/models";
import { DB } from "./db.offline";
import { appToDb, dbToApp } from "../../util/caseTransform";

export class CourseAssignmentsOffline {
  static save(rows: CourseAssignment[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
          INSERT INTO course_assignments (
            id,
            staff_id,
            subject_id,
            class_id,
            created_at,
            updated_at
          ) VALUES (
            @id,
            @staff_id,
            @subject_id,
            @class_id,
            @created_at,
            @updated_at
          )
          ON CONFLICT(id) DO UPDATE SET
            staff_id = excluded.staff_id,
            subject_id = excluded.subject_id,
            class_id = excluded.class_id,
            created_at = excluded.created_at,
            updated_at = excluded.updated_at;
    `);

    const txn = db.transaction((assigns: CourseAssignment[]) => {
      for (const row of assigns) {
        const dbRow = appToDb(row);
        stmt.run(dbRow);
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string): CourseAssignment[] {
    const rows = DB.getConnection()
      .prepare(`SELECT * FROM course_assignments WHERE updated_at > ?`)
      .all(lastSynced) as Record<string, any>[];

    if (!rows) return [];

    return rows.map((row) => dbToApp<CourseAssignment>(row))
  }
}
