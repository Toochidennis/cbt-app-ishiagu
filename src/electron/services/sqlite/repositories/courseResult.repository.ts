import Database from 'better-sqlite3';
import { type CourseResult, type RawRow } from '../models';
import { dbToApp } from '../../../../electron/util/caseTransform';

export class CourseResultRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    findCourseResultsByCourse(
        classId: string,
        subjectId: string,
        year: number,
        term: number
    ): CourseResult[] {
        const rows = this.db
            .prepare(`
                SELECT
                    u.id AS student_id,
                    u.reg_number,
                    u.surname || ' ' || u.first_name || ' ' || IFNULL(u.middle_name, '') AS student_name,
                    r.id AS result_id,
                    r.total_score,
                    a.assessment_name,
                    a.max_score,
                FROM
                    course_registrations cr
                JOIN users u ON cr.student_id = u.id
                LEFT JOIN results r ON r.student_id = u.id
                    AND r.subject_id = cr.subject_id
                    AND r.class_id = u.class_id
                    AND r.term = cr.term
                    AND r.year = cr.year
                JOIN assessments a ON a.subject_id = cr.subject_id
                    AND a.class_id = u.class_id
                WHERE
                    u.class_id = @classId
                    AND cr.subject_id = @subjectId
                    AND cr.term = @term
                    AND cr.year = @year
                ORDER BY
                    u.surname, u.first_name;
            `)
            .all({ classId, subjectId, term, year }) as Record<string, any>[];

        return this.mapToCourseResult(rows.map(row => dbToApp<RawRow>(row)));
    }

    private mapToCourseResult(rows: RawRow[]): CourseResult[] {
        const map = new Map<string, CourseResult>();

        for (const row of rows) {
            if (!map.has(row.studentId)) {
                map.set(row.studentId, {
                    studentName: row.studentName,
                    regNo: row.username,
                    resultId: row.resultId,
                    totalScore: row.totalScore || 0,
                    assessments: []
                });
            }

            const courseResult = map.get(row.studentId)!;
            courseResult.assessments.push({
                assessment_name: row.assessmentName,
                score: row.score,
                max_score: row.maxScore
            });
        }

        return Array.from(map.values());
    }
}