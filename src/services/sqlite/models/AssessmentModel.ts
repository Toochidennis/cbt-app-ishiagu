import Database from "better-sqlite3";

export class AssessmentModel {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(data: any) {
        return this.db.prepare(`
            INSERT INTO assessments (
                id, subject_id, class_id,
                assessment_name, max_score
            )
            VALUES (
                @id, @subject_id, @class_id,
                @assessment_name, @max_score
            )
        `).run(data);
    }

    findByClassAndSubject(class_id: string, subject_id: string) {
        return this.db.prepare(`
            SELECT * FROM assessments
            WHERE class_id = ? AND subject_id = ?
        `).all(class_id, subject_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM assessments WHERE id = ?`)
            .run(id);
    }
}