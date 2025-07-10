import Database from "better-sqlite3";
import { ExamSchedule } from "../models";
import { appToDb } from "../../../../electron/util/caseTransform";

export class ExamScheduleRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(examSchedule: ExamSchedule) {
        const dbExamSchedule = appToDb(examSchedule);
        return this.db.prepare(`
            INSERT INTO exam_schedules (
            id, description, subject_id, class_id, exam_date,
            duration_minutes, year, term, created_by
            ) VALUES (
            @id, @description, @subject_id, @class_id, @exam_date,
            @duration_minutes, @year, @term, @created_by
            )
        `).run(dbExamSchedule);
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