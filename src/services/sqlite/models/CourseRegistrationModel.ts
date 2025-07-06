import Database from "better-sqlite3";

export class CourseRegistrationModel {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(data:any) {
        return this.db.prepare(`
        INSERT INTO course_registrations (id, student_id, subject_id, term, year)
        VALUES (@id, @student_id, @subject_id, @term, @year)
        `).run(data);
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