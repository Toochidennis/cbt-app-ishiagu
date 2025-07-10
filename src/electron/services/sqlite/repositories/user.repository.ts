import Database from 'better-sqlite3';
import { User } from '../models';
import { dbToApp, appToDb } from '../../../../electron/util/caseTransform';

export class UserRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    findById(id: string) {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE id = ?`);
        return stmt.get(id);
    }

    create(user: User) {
        const dbUser = appToDb(user);
        return this.db.prepare(`
            INSERT INTO users (
                id, display_id, reg_number, role,
                surname, first_name, middle_name,
                class_id, gender, date_of_birth,
                contact, state, lga, address,
                username, password_hash, is_active
            )
            VALUES (
                @id, @display_id, @reg_number, @role,
                @surname, @first_name, @middle_name,
                @class_id, @gender, @date_of_birth,
                @contact, @state, @lga, @address,
                @username, @password_hash, @is_active
            )
        `).run(dbUser);
    }

    createMany(users: User[]) {
        const insert = this.db.prepare(`
            INSERT INTO users (
                id, display_id, reg_number, role,
                surname, first_name, middle_name,
                class_id, gender, date_of_birth,
                contact, state, lga, address,
                username, password_hash, is_active
            )
            VALUES (
                @id, @display_id, @reg_number, @role,
                @surname, @first_name, @middle_name,
                @class_id, @gender, @date_of_birth,
                @contact, @state, @lga, @address,
                @username, @password_hash, @is_active
            )
        `);

        const insertMany = this.db.transaction((users: User[]) => {
            for (const user of users) {
                insert.run(appToDb(user));
            }
        });

        insertMany(users);
    }


    findByRole(role: string): User[] {
        const rows = this.db.prepare(`SELECT * FROM users WHERE role = ?`)
            .all(role) as Record<string, any>[];

        return rows.map(row => dbToApp<User>(row));
    }

    findByClassId(class_id: string): User[] {
        const rows = this.db.prepare(`SELECT * FROM users WHERE class_id = ?`)
            .all(class_id) as Record<string, any>[];

        return rows.map(row => dbToApp<User>(row));
    }

    update(id: string, data: Partial<User>) {
        const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        return this.db.prepare(`UPDATE users SET ${fields} WHERE id = @id`)
            .run({ ...data, id });
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM users WHERE id = ?`)
            .run(id);
    }
}
