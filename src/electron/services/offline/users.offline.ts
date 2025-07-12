import { DB } from "./db.offline";
import { appToDb } from "../../../electron/util/caseTransform";
import type { User } from "../sqlite/models";

export class UsersOffline {
  static save(rows: User[]) {
    const db = DB.getConnection();

    const stmt = db.prepare(`
      INSERT INTO users (
        id, display_id, reg_number, role, surname, first_name,
        middle_name, class_id, gender, date_of_birth, contact,
        state, lga, address, username, password_hash, is_active,
        created_at, updated_at
      ) VALUES (
        @id, @display_id, @reg_number, @role, @surname, @first_name,
        @middle_name, @class_id, @gender, @date_of_birth, @contact,
        @state, @lga, @address, @username, @password_hash, @is_active,
        @created_at, @updated_at
      )
      ON CONFLICT(id) DO UPDATE SET
        display_id=excluded.display_id,
        reg_number=excluded.reg_number,
        role=excluded.role,
        surname=excluded.surname,
        first_name=excluded.first_name,
        middle_name=excluded.middle_name,
        class_id=excluded.class_id,
        gender=excluded.gender,
        date_of_birth=excluded.date_of_birth,
        contact=excluded.contact,
        state=excluded.state,
        lga=excluded.lga,
        address=excluded.address,
        username=excluded.username,
        password_hash=excluded.password_hash,
        is_active=excluded.is_active,
        created_at=excluded.created_at,
        updated_at=excluded.updated_at;
    `);

    const txn = db.transaction((users: User[]) => {
      for (const row of users) {
        stmt.run(appToDb(row));
      }
    });

    txn(rows);
  }

  static getUpdatedSince(lastSynced: string) {
    const db = DB.getConnection();
    return db
      .prepare(`SELECT * FROM users WHERE updated_at > ?`)
      .all(lastSynced);
  }
}
