import Database from "better-sqlite3";
import { Question } from "../models";
import { appToDb } from "../../../../electron/util/caseTransform";

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

    createMany(examQuestions: Question[]) {
        const insert = this.db.prepare(`
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
        `);

        const insertMany = this.db.transaction((questions: Question[]) => {
            const results: { id: string; changes: number }[] = [];

            for (const question of questions) {
                const dbQuestion = appToDb(question);
                const result = insert.run(dbQuestion);
                results.push({
                    id: dbQuestion.id,
                    changes: result.changes,
                });
            }

            return results;
        });

        return insertMany(examQuestions);
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