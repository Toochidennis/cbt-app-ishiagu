import Database from 'better-sqlite3';

export class CourseAssignmentRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    create(assignment: any) {
        return this.db.prepare(`
                INSERT INTO course_assignments (id, staff_id, subject_id, class_id)
                VALUES (@id, @staff_id, @subject_id, @class_id)
            `).run(assignment);
    }

    findAll() {
        return this.db.prepare(`SELECT * FROM course_assignments`)
            .all();
    }

    findByClass(class_id: string) {
        return this.db.prepare(`SELECT * FROM course_assignments WHERE class_id = ?`)
            .all(class_id);
    }

    findByStaff(staff_id: string) {
        return this.db.prepare(`SELECT * FROM course_assignments WHERE staff_id = ?`)
            .all(staff_id);
    }

    delete(id: string) {
        return this.db.prepare(`DELETE FROM course_assignments WHERE id = ?`)
            .run(id);
    }
}
