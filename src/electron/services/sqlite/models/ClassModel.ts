import Database from "better-sqlite3";

export class ClassModel {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(cls: any) {
        return this.db.prepare(`
            INSERT INTO classes (id, name, form_teacher)
            VALUES (@id, @name, @form_teacher)
            `).run(cls);
    }

    findAll() {
        return this.db.prepare(`SELECT * FROM classes`).all();
    }

    findById(id: string) {
        return this.db.prepare(`SELECT * FROM classes WHERE id = ?`).get(id);
    }

    findByTeacher(teacherId: string) {
        return this.db.prepare(`SELECT * FROM classes WHERE form_teacher = ?`).all(teacherId);
    }

    update(id: string, data: any) {
        const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        return this.db.prepare(`UPDATE classes SET ${fields} WHERE id = @id`).run({ ...data, id });
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM classes WHERE id = ?`).run(id);
    }
}
