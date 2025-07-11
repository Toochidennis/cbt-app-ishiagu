import Database from "better-sqlite3";
import { ExamSchedule, ExamScheduleWithSubject } from "../models";
import { appToDb, dbToApp } from "../../../../electron/util/caseTransform";

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
        return this.db.prepare(`SELECT * FROM exam_schedules`)
            .all();
    }

    findBySession(classId: string, term: number, year: number): ExamScheduleWithSubject[] {
        const rows = this.db.prepare(`
            SELECT 
                e.*, s.name AS subject_name
            FROM exam_schedules e
                INNER JOIN subjects s ON e.subject_id = s.id
            WHERE
                class_id = @classId AND term = @term AND year = @year
            `).all({ classId, term, year }) as Record<string, any>[];

        return rows.map(row => dbToApp<ExamScheduleWithSubject>(row));
    }

    findByClass(class_id: string) {
        return this.db.prepare(`SELECT * FROM exam_schedules WHERE class_id = ?`)
            .all(class_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM exam_schedules WHERE id = ?`)
            .run(id);
    }
}