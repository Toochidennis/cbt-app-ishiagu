import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';
import Database from 'better-sqlite3';

export class ExportScoresBySubject {
    private db: Database.Database;
    private exportDir: string;

    constructor(db: Database.Database, exportDir = './exports') {
        this.db = db;
        this.exportDir = exportDir;

        if (!fs.existsSync(this.exportDir)) {
            fs.mkdirSync(this.exportDir, { recursive: true });
        }
    }

    exportByClassId(classId: string, term = 3, year = 2025) {
        const subjects = this.db.prepare(
            `SELECT DISTINCT s.id, s.name
            FROM course_registrations cr
            JOIN users u ON u.id = cr.student_id
            JOIN subjects s ON s.id = cr.subject_id
            WHERE u.class_id = ?
                AND cr.term = ?
                AND cr.year = ?`
        ).all(classId, term, year);

        for (const subject of subjects) {
            const rows = this.db.prepare(
                `
                            SELECT 
                                u.username AS reg_number,
                                u.surname,
                                u.first_name,
                                u.middle_name,
                                s.name AS subject_name,
                                COALESCE(r.exam, 0) AS exam_score
                            FROM users u
                            JOIN course_registrations cr ON cr.student_id = u.id
                            JOIN subjects s ON s.id = cr.subject_id
                            LEFT JOIN results r 
                                ON r.student_id = u.id 
                                AND r.subject_id = s.id
                                AND r.term = ?
                                AND r.year = ?
                                WHERE u.class_id = ?
                                AND s.id = ?
                            ORDER BY u.surname, u.first_name
        `).all(term, year, classId, subject.id);

            const fileName = `${subject.name.replace(/\s+/g, '_')}.csv`;
            const filePath = path.join(this.exportDir, fileName);
            const csv = parse(rows);
            fs.writeFileSync(filePath, csv);

            console.log(`Exported: ${filePath}`);
        }
    }
}
