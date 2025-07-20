import Database from "better-sqlite3";
import { Assessment } from '../models'
import { appToDb, dbToApp } from "../../../util/caseTransform";

export class AssessmentRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(assessment: Assessment) {
        const dbAssessment = appToDb(assessment);
        return this.db.prepare(`
            INSERT INTO assessments (
                id, subject_id, class_id,
                assessment_name, max_score
            )
            VALUES (
                @id, @subject_id, @class_id,
                @assessment_name, @max_score
            )
        `).run(dbAssessment);
    }

    findAll(): Assessment[] {
        const rows = this.db.prepare(`
            SELECT assessment_name, max_score FROM assessments 
        `).all() as Record<string, any>[];

        return rows.map(row => dbToApp<Assessment>(row));
    }

    findByClassAndSubject(classId: string, subjectId: string): Assessment[] {
        const rows = this.db.prepare(`
            SELECT * FROM assessments
            WHERE class_id = @classId AND subject_id = @subjectId
        `).all({ classId, subjectId }) as Record<string, any>[];

        return rows.map(row => dbToApp<Assessment>(row));
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM assessments WHERE id = ?`)
            .run(id);
    }
}