import Database from "better-sqlite3";
import { ExamAttempt } from "../models";
import { appToDb, dbToApp } from "../../../util/caseTransform";

export class ExamAttemptRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(examAttempt: ExamAttempt) {
        const dbExamAttempt = appToDb(examAttempt);
        return this.db.prepare(`
            INSERT INTO exam_attempts (
                id, exam_schedule_id, student_id, status
            )
            VALUES (
                @id, @exam_schedule_id, @student_id, @status
            )
        `).run(dbExamAttempt)
    }

    findAttemptById(examScheduleId: string, studentId: string): ExamAttempt {
        const row = this.db.prepare(`
                SELECT status FROM exam_attempts
                WHERE
                    exam_schedule_id = @examScheduleId 
                AND 
                    student_id = @studentId
            `).get({ examScheduleId, studentId }) as Record<string, any>;

        return dbToApp<ExamAttempt>(row);
    }
}