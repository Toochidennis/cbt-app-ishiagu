
import Database from "better-sqlite3";
import { Subject } from "../models";
import { appToDb, dbToApp } from "../../../../electron/util/caseTransform";

export class SubjectRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(subject: Subject) {
        const dbSubject = appToDb(subject);

        return this.db.prepare(`
            INSERT INTO subjects (id, code, name)
            VALUES (@id, @code, @name)
        `).run(dbSubject);
    }

    findAll(): Subject[] {
        const rows =
            this.db.prepare(`SELECT * FROM subjects`)
                .all() as Record<string, any>[];

        return rows.map(row => dbToApp<Subject>(row));
    }

    findById(id: string): Subject {
        const row =
            this.db.prepare(`SELECT * FROM subjects WHERE id = ?`)
                .get(id) as Record<string, any>;

        return dbToApp<Subject>(row);
    }

    findByCode(code: string): Subject {
        const row = this.db.prepare(`SELECT * FROM subjects WHERE code = ?`)
            .get(code) as Record<string, any>;

        return dbToApp<Subject>(row);
    }

    findByClassAndTerm(classId: string, term: number, year: number): Subject[] {
        const rows = this.db.prepare(`
            SELECT DISTINCT 
                s.id, s.name, s.code
            FROM course_registrations cr
            JOIN users u ON cr.student_id = u.id
            JOIN subjects s ON s.id = cr.subject_id
            WHERE u.class_id = @classId
                AND cr.term = @term
                AND cr.year = @year
            ORDER BY s.name
        `).all({ classId, term, year }) as Record<string, any>[];

        return rows.map(row => dbToApp<Subject>(row));
    }

    update(id: string, data: Subject) {
        const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        return this.db.prepare(`UPDATE subjects SET ${fields} WHERE id = @id`)
            .run({ ...data, id });
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM subjects WHERE id = ?`)
            .run(id);
    }
}
