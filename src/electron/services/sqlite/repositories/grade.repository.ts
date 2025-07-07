import Database from "better-sqlite3";
import { appToDb, dbToApp } from "../../../util/caseTransform";
import { Grade } from "../models";

export class GradeRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(grade: Grade) {
        const dbGrade = appToDb(grade);
        return this.db.prepare(`
            INSERT INTO grades (id, min_score, max_score, grade, remark)
            VALUES (@id, @min_score, @max_score, @grade, @remark)
        `).run(dbGrade);
    }

    findAll(): Grade[] {
        const rows = this.db.prepare(`SELECT * FROM grades`)
            .all() as Record<string, any>[];
            
        return rows.map(row => dbToApp<Grade>(row));
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM grades WHERE id = ?`).run(id);
    }
}