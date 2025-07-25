import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import Database from 'better-sqlite3';
import { dbToApp } from '../../../../electron/util/caseTransform';
import type { Subject } from '../models';

export class ExportRepository {
    private db: Database.Database;
    private exportDir: string;

    constructor(db: Database.Database, exportDir = './exports') {
        this.db = db;
        this.exportDir = exportDir;

        if (!fs.existsSync(this.exportDir)) {
            fs.mkdirSync(this.exportDir, { recursive: true });
        }
    }

    async exportByClassId(classId: string, term = 3, year = 2025) {
        const workbook = XLSX.utils.book_new();

        const results = this.db.prepare(
            `SELECT DISTINCT s.id, s.name
            FROM course_registrations cr
            JOIN users u ON u.id = cr.student_id
            JOIN subjects s ON s.id = cr.subject_id
            WHERE cr.class_id = ?
                AND cr.term = ?
                AND cr.year = ?
            `).all(classId, term, year) as Record<string, any>[];

        const subjects = results.map(row => dbToApp<Subject>(row));

        for (const subject of subjects) {
            const rows = this.db.prepare(`
                    SELECT 
                        u.username AS reg_number,
                        u.surname,
                        u.first_name,
                        u.middle_name,
                        s.name AS subject_name,
                        COALESCE(r.exam, 0) AS exam_score
                    FROM course_registrations cr
                    JOIN users u ON u.id = cr.student_id
                    JOIN subjects s ON s.id = cr.subject_id
                    LEFT JOIN results r 
                        ON r.student_id = u.id 
                        AND r.subject_id = s.id
                        AND r.class_id = cr.class_id
                        AND r.term = cr.term
                        AND r.year = cr.year
                    WHERE cr.class_id = ?
                    AND cr.subject_id = ?
                    AND cr.term = ?
                    AND cr.year = ?
                    ORDER BY u.surname, u.first_name`
            ).all(classId, subject.id, term, year);

            if (rows.length > 0) {
                const sheet = XLSX.utils.json_to_sheet(rows);
                const cleanName = subject.name.replace(/[^a-z0-9]/gi, '_').substring(0, 31);
                XLSX.utils.book_append_sheet(workbook, sheet, cleanName);
            }

            const fileName = `SSS2_Results.xlsx`;
            const filePath = path.join(this.exportDir, fileName);

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Excel file saved to: ${filePath}`);
        }
    }
}
