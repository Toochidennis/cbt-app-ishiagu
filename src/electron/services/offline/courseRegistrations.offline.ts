import type { CourseRegistration } from "../sqlite/models";
import { DB } from "./db.offline";
import { appToDb } from "../../util/caseTransform";

export class CourseRegistrationsOffline {
    static save(rows: CourseRegistration[]) {
        const db = DB.getConnection();

        const stmt = db.prepare(`
            INSERT INTO course_registrations (
            id,
            student_id,
            subject_id,
            term,
            year,
            created_at,
            updated_at
            )
            VALUES (
            @id,
            @student_id,
            @subject_id,
            @term,
            @year,
            @created_at,
            @updated_at
            )
            ON CONFLICT(student_id, subject_id, term, year) DO UPDATE SET
            created_at = excluded.created_at,
            updated_at = excluded.updated_at;
    `);

        const txn = db.transaction((regs: CourseRegistration[]) => {
            for (const row of regs) {
                stmt.run(appToDb(row));
            }
        });

        txn(rows);
    }

    static getUpdatedSince(lastSynced: string) {
        return DB.getConnection()
            .prepare(`SELECT * FROM course_registrations WHERE updated_at > ?`)
            .all(lastSynced);
    }
}
