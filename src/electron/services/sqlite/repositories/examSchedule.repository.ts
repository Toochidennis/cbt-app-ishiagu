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
            id, description, subject_id, class_id, exam_date, time,
            duration_minutes, year, term, created_by
            ) VALUES (
            @id, @description, @subject_id, @class_id, @exam_date, @time,
            @duration_minutes, @year, @term, @created_by
            )
        `).run(dbExamSchedule);
    }

    findAll() {
        return this.db.prepare(`SELECT * FROM exam_schedules`)
            .all();
    }

    findStudentExams(
        classId: string,
        studentId: string,
        term: number,
        year: number
    ): ExamScheduleWithSubject[] {
        const rows = this.db.prepare(`
        SELECT 
            e.*, 
            s.name AS subject_name
        FROM course_registrations cr
        INNER JOIN exam_schedules e 
            ON e.subject_id = cr.subject_id
            AND e.class_id = @classId
        INNER JOIN subjects s 
            ON s.id = e.subject_id
        WHERE 
            cr.student_id = @studentId
            AND cr.term = @term
            AND cr.year = @year
            AND e.term = @term
            AND e.year = @year
    `).all({ classId, studentId, term, year }) as Record<string, any>[];

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