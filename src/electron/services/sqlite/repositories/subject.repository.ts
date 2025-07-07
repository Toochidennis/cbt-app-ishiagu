
import Database from "better-sqlite3";

export class SubjectRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(subject: any) {
        return this.db.prepare(`
            INSERT INTO subjects (id, code, name)
            VALUES (@id, @code, @name)
        `).run(subject);
    }

    findAll() {
        return this.db.prepare(`SELECT * FROM subjects`).all();
    }

    findById(id: string) {
        return this.db.prepare(`SELECT * FROM subjects WHERE id = ?`).get(id);
    }

    findByCode(code: string) {
        return this.db.prepare(`SELECT * FROM subjects WHERE code = ?`).get(code);
    }

    update(id: string, data: any) {
        const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        return this.db.prepare(`UPDATE subjects SET ${fields} WHERE id = @id`).run({ ...data, id });
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM subjects WHERE id = ?`).run(id);
    }
}
