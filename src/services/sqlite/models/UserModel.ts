import Database from 'better-sqlite3';

export class UserModel {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    findById(id: string) {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE id = ?`);
        return stmt.get(id);
    }

    create(user: any) {
        const stmt = this.db.prepare(`
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
        stmt.run(user);
    }

    findByRole(role: string) {
        return this.db.prepare(`SELECT * FROM users WHERE role = ?`).all(role);
    }

    update(id: string, data: any) {
        const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
        return this.db.prepare(`UPDATE users SET ${fields} WHERE id = @id`)
            .run({ ...data, id });
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
    }

    findByClassId(class_id: string) {
        return this.db.prepare(`SELECT * FROM users WHERE class_id = ?`).all(class_id);
    }

}
