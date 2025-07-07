import Database from 'better-sqlite3';

export class ResultModel {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    findByStudent(studentId: string) {
        return this.db
            .prepare(`SELECT * FROM results WHERE student_id = ?`)
            .all(studentId);
    }

    create(result: any) {
        const stmt = this.db.prepare(`
            INSERT INTO results (
                id, student_id, subject_id, class_id,
                term, year, ca1, ca2, exam,
                total_score, grade, approved,
                approved_at, remarks
            )
            VALUES (
                @id, @student_id, @subject_id, @class_id,
                @term, @year, @ca1, @ca2, @exam,
                @total_score, @grade, @approved,
                @approved_at, @remarks
            )
        `);
        stmt.run(result);
    }

    findByClass(class_id: string) {
        return this.db.prepare(`SELECT * FROM results WHERE class_id = ?`)
            .all(class_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM results WHERE id = ?`)
            .run(id);
    }
}
