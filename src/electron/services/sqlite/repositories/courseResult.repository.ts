import Database from 'better-sqlite3';
import { Assessment, type CourseResult, type RawRow } from '../models';
import { dbToApp } from '../../../../electron/util/caseTransform';
import { AssessmentRepository } from './index';

export class CourseResultRepository {
    private db: Database.Database;
    private assessmentRepository: AssessmentRepository;

    constructor(db: Database.Database) {
        this.db = db;
        this.assessmentRepository = new AssessmentRepository(db);
    }

    findCourseResults(
        classId: string,
        subjectId: string,
        year: number,
        term: number
    ): CourseResult[] {
        const rows = this.db
            .prepare(`
                SELECT
                    u.id AS student_id,
                    u.username,
                    u.surname || ' ' || u.first_name || ' ' || IFNULL(u.middle_name, '') AS student_name,
                    r.id AS result_id,
                    r.ca1,
                    r.ca2,
                    r.exam,
                    r.total_score
                FROM
                    course_registrations cr
                JOIN users u ON cr.student_id = u.id
                LEFT JOIN results r ON r.student_id = u.id
                    AND r.subject_id = cr.subject_id
                    AND r.class_id = cr.class_id
                    AND r.term = cr.term
                    AND r.year = cr.year
                WHERE
                    cr.class_id = @classId
                    AND cr.subject_id = @subjectId
                    AND cr.term = @term
                    AND cr.year = @year
                ORDER BY
                    u.surname, u.first_name;
            `)
            .all({ classId, subjectId, term, year }) as Record<string, any>[];

        const assessments = this.assessmentRepository.findAll();

        return this.mapToCourseResult(rows.map(row => dbToApp<RawRow>(row)), assessments);
    }

    private mapToCourseResult(rows: RawRow[], assessments: Assessment[]): CourseResult[] {
        return rows.map(row => ({
            studentName: row.studentName,
            regNo: row.username,
            resultId: row.resultId,
            totalScore: row.totalScore,
            grade: this.getGrade(row.totalScore),
            assessments: [
                {
                    assessmentName: '1st CA',
                    maxScore: this.getMaxScore(assessments, '1st CA'),
                    score: row.ca1
                },
                {
                    assessmentName: '2nd CA',
                    maxScore: this.getMaxScore(assessments, '2nd CA'),
                    score: row.ca2
                },
                {
                    assessmentName: 'Exam',
                    maxScore: this.getMaxScore(assessments, 'Exam'),
                    score: row.exam
                }
            ]
        }));
    }

    private getMaxScore(assessments: Assessment[], name: string): number {
        return assessments.find(a => a.assessmentName.toLowerCase() === name.toLowerCase())?.maxScore || 0;
    }

    private getGrade(score: number): string {
        if (score >= 70) return 'A';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        if (score >= 45) return 'D';
        if (score >= 40) return 'E';
        return 'F';
    }
}