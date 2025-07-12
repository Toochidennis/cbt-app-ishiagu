import type { Question } from "../sqlite/models";
import { DB } from "./db.offline";
import { appToDb } from "../../../electron/util/caseTransform";

export class QuestionsOffline {
    static save(rows: Question[]) {
        const db = DB.getConnection();

        const stmt = db.prepare(`
      INSERT INTO questions (
        id,
        exam_schedule_id,
        question_text,
        options,
        correct_option,
        marks,
        created_by,
        created_at,
        updated_at
      )
      VALUES (
        @id,
        @exam_schedule_id,
        @question_text,
        @options,
        @correct_option,
        @marks,
        @created_by,
        @created_at,
        @updated_at
      )
      ON CONFLICT(id) DO UPDATE SET
        exam_schedule_id = excluded.exam_schedule_id,
        question_text = excluded.question_text,
        options = excluded.options,
        correct_option = excluded.correct_option,
        marks = excluded.marks,
        created_by = excluded.created_by,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at;
    `);

        const txn = db.transaction((questions: Question[]) => {
            for (const row of questions) {
                stmt.run(appToDb(row));
            }
        });

        txn(rows);
    }

    static getUpdatedSince(lastSynced: string) {
        return DB.getConnection()
            .prepare(`SELECT * FROM questions WHERE updated_at > ?`)
            .all(lastSynced);
    }
}
