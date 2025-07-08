import Database from 'better-sqlite3';
import { Result } from '../models';
import { dbToApp, appToDb } from '../../../../electron/util/caseTransform';

export class ResultRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(result: Result) {
        const dbResult = appToDb(result);

        return this.db.prepare(`
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
        `).run(dbResult);
    }

    update(id: string, data: Partial<Result>) {
        const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        return this.db.prepare(`UPDATE results SET ${fields} WHERE id = @id`)
            .run({ ...data, id });
    }

    findByStudent(studentId: string): Result[] {
        const rows = this.db
            .prepare(`SELECT * FROM results WHERE student_id = @studentId`)
            .all({studentId}) as Record<string, any>[];

        return rows.map(row => dbToApp<Result>(row));
    }

    findByClass(classId: string): Result[] {
        const rows = this.db.prepare(`SELECT * FROM results WHERE class_id = @classId`)
            .all({classId}) as Record<string, any>[];

        return rows.map(row => dbToApp<Result>(row));
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM results WHERE id = @id`)
            .run({id});
    }
}
