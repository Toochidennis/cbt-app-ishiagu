import Database from "better-sqlite3";

export class GradeModel {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(data: any) {
        return this.db.prepare(`
            INSERT INTO grades (id, min_score, max_score, grade, remark)
            VALUES (@id, @min_score, @max_score, @grade, @remark)
        `).run(data);
    }

    findAll() {
        return this.db.prepare(`SELECT * FROM grades`).all();
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM grades WHERE id = ?`).run(id);
    }
}