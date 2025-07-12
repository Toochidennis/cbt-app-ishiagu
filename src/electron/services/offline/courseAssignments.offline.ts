import type { CourseAssignment } from "../sqlite/models";
import { DB } from "./db.offline";
import { appToDb } from "../../util/caseTransform";

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
          ON CONFLICT(staff_id, subject_id, class_id) DO UPDATE SET
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

  static getUpdatedSince(lastSynced: string) {
    return DB.getConnection()
      .prepare(`SELECT * FROM course_assignments WHERE updated_at > ?`)
      .all(lastSynced);
  }
}
