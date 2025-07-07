import Database from "better-sqlite3";

export class ExamScheduleRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(data: any) {
        return this.db.prepare(`
            INSERT INTO exam_schedules (
            id, description, subject_id, class_id, exam_date,
            duration_minutes, year, term, created_by
            ) VALUES (
            @id, @description, @subject_id, @class_id, @exam_date,
            @duration_minutes, @year, @term, @created_by
            )
        `).run(data);
    }

    findAll() {
        return this.db.prepare(`SELECT * FROM exam_schedules`).all();
    }

    findByClass(class_id: string) {
        return this.db.prepare(`SELECT * FROM exam_schedules WHERE class_id = ?`).all(class_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM exam_schedules WHERE id = ?`).run(id);
    }
}