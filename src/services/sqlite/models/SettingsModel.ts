import Database from "better-sqlite3";

export class SettingsModel {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(data: any) {
        return this.db.prepare(`
            INSERT INTO settings (id, school_name, logo, term, year)
            VALUES (@id, @school_name, @logo, @term, @year)
        `).run(data);
    }

    getCurrent() {
        return this.db.prepare(`SELECT * FROM settings ORDER BY created_at DESC LIMIT 1`)
            .get();
    }
}
