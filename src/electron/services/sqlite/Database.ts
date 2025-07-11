import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { app } from 'electron';
import { isDev } from "../../util/util";


export class LocalDatabase {
    private db: Database.Database;

    constructor() {
        const dbPath = isDev()
            ? path.join(app.getAppPath(), '/dist-electron/data/cbt.sqlite')
            : path.join(process.resourcesPath, "data", "cbt.sqlite");

        // Ensure parent folders exist
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });

        this.db = new Database(dbPath);

        this.enableForeignKeys();
        this.runMigrations();
    }

    private enableForeignKeys() {
        this.db.pragma("foreign_keys = ON");
    }

    private runMigrations() {
        const schemaPath = isDev()
            ? path.join(app.getAppPath(), '/dist-electron/sqlite/schema.sql')
            : path.join(process.resourcesPath, "schema.sql");

        // Check that the file exists
        if (!fs.existsSync(schemaPath)) {
            console.log(`Schema file not found: ${schemaPath}`);
            throw new Error(`Schema file not found: ${schemaPath}`);
        }

        console.log(schemaPath);
        const sql = fs.readFileSync(schemaPath, "utf-8");
        this.db.exec(sql);
    }

    getConnection(): Database.Database {
        return this.db;
    }

    close() {
        this.db.close();
    }
}
