import Database from "better-sqlite3";

export class QuestionRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(data: any) {
        return this.db.prepare(`
            INSERT INTO questions (
                id, exam_schedule_id, question_text,
                options, correct_option, marks,
                created_by
            ) 
            VALUES (
                @id, @exam_schedule_id, @question_text,
                @options, @correct_option, @marks,
                @created_by
            )
        `).run(data);
    }

    findByExam(exam_schedule_id: string) {
        return this.db.prepare(`SELECT * FROM questions WHERE exam_schedule_id = ?`)
            .all(exam_schedule_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM questions WHERE id = ?`)
            .run(id);
    }
}