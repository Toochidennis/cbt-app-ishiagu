import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export class LocalDatabase {
    private db: Database.Database;

    constructor() {
        const dbPath = path.join(__dirname, '..', '..', '..', 'data', 'cbt.sqlite');

        fs.mkdirSync(path.dirname(dbPath), { recursive: true });

        this.db = new Database(dbPath);

        this.enableForeignKeys();
        this.runMigrations();
    }

    private enableForeignKeys() {
        this.db.pragma('foreign_keys = ON',)
    }

    private runMigrations() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf-8');
        this.db.exec(sql);
    }

    get connection(): Database.Database {
        return this.db;
    }

    close() {
        this.db.close();
    }
}
