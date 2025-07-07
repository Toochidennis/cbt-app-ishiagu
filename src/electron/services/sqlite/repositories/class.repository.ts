import Database from "better-sqlite3";
import { Class } from '../models'
import { appToDb, dbToApp } from "../../../util/caseTransform";

export class ClassRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(cls: Class) {
        const dbClass = appToDb(cls);
        return this.db.prepare(`
            INSERT INTO classes (id, name, form_teacher)
            VALUES (@id, @name, @form_teacher)
            `).run(dbClass);
    }

    findAll(): Class[] {
        const rows = this.db.prepare(`SELECT * FROM classes`)
            .all() as Record<string, any>[];

        return rows.map(row => dbToApp<Class>(row));
    }

    findById(id: string): Class | null {
        const row = this.db.prepare(`SELECT * FROM classes WHERE id = ?`)
            .get(id);

        if (!row) return null;

        return dbToApp<Class>(row);
    }

    findByTeacher(teacherId: string): Class | null {
        const row = this.db.prepare(`SELECT * FROM classes WHERE form_teacher = ?`)
            .all(teacherId);

        if (!row) return null;

        return dbToApp<Class>(row);
    }

    update(id: string, data: Partial<Class>) {
        const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        return this.db.prepare(`UPDATE classes SET ${fields} WHERE id = @id`)
            .run({ ...data, id });
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM classes WHERE id = ?`)
            .run(id);
    }
}
