import Database from "better-sqlite3";
import type { CourseRegistration } from "../models";
import { appToDb } from "../../../../electron/util/caseTransform";

export class CourseRegistrationRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(courseReg: CourseRegistration) {
        const dbCourseReg = appToDb(courseReg);
        return this.db.prepare(`
            INSERT OR IGNORE INTO course_registrations (
                id, student_id, subject_id, term, year
            )
            VALUES (
                @id, @student_id, @subject_id, @term, @year
            )
        `).run(dbCourseReg);
    }

    createMany(courseRegs: CourseRegistration[]) {
        const insert = this.db.prepare(`
            INSERT OR IGNORE INTO course_registrations (
                id, student_id, subject_id, term, year
            )
            VALUES (
                @id, @student_id, @subject_id, @term, @year
            )
        `);

        const insertMany = this.db.transaction((regs: CourseRegistration[]) => {
            const results: { id: string; changes: number }[] = [];

            for (const reg of regs) {
                const dbReg = appToDb(reg);
                const result = insert.run(dbReg);
                results.push({
                    id: dbReg.id,
                    changes: result.changes,
                });
            }

            return results;
        });

        return insertMany(courseRegs);
    }

    findAll() {
        return this.db.prepare(`SELECT
  cr.*,
  s.name AS subject_name
FROM course_registrations cr
JOIN subjects s ON cr.subject_id = s.id
WHERE cr.student_id = '339e8208-888b-442c-a281-a768ca6e5cfe'
  AND cr.term = 3
  AND cr.year = 2025;
`).all();
    }

    findByStudent(student_id: string) {
        return this.db.prepare(`SELECT * FROM course_registrations WHERE student_id = ?`).all(student_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM course_registrations WHERE created_at = ?`).run(id);
    }
}