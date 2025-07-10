import Database from "better-sqlite3";
import { appToDb, dbToApp } from "../../../util/caseTransform";
import { Setting } from "../models";

export class SettingRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(setting: Setting) {
        const dbSetting = appToDb(setting)
        return this.db.prepare(`
            INSERT INTO settings (id, school_name, logo, term, year)
            VALUES (@id, @school_name, @logo, @term, @year)
        `).run(dbSetting);
    }

    getCurrent(): Setting {
        const row = this.db.prepare(
            `SELECT * FROM settings 
                ORDER BY created_at DESC
                LIMIT 1`
        ).get() as Record<string, any>;

        return dbToApp<Setting>(row);
    }
}
