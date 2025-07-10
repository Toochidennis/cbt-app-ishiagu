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
        return this.db.prepare(`SELECT * FROM course_registrations`).all();
    }

    findByStudent(student_id: string) {
        return this.db.prepare(`SELECT * FROM course_registrations WHERE student_id = ?`).all(student_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM course_registrations WHERE id = ?`).run(id);
    }
}