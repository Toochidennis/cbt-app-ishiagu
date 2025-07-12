import { isDev } from '@/electron/util/util';
import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

export class DB {
    private static db: Database.Database;

    static getConnection(): Database.Database {
        if (!DB.db) {
            const dbPath = isDev()
                ? path.join(app.getAppPath(), '/dist-electron/data/cbt.sqlite')
                : path.join(process.resourcesPath, "data", "cbt.sqlite");
            DB.db = new Database(dbPath);
        }
        return DB.db;
    }
}
