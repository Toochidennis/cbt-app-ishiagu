import { v4 as uuid } from 'uuid';
import { Setting, Assessment, Grade } from "../models";
import Database from 'better-sqlite3';
import { SettingRepository, AssessmentRepository, GradeRepository } from "../repositories";

const gradeData = [
    {
        id: uuid(),
        label: 'A+',
        min_score: 95,
        max_score: 100,
        description: 'Distinction',
    },
    {
        id: uuid(),
        label: 'A',
        min_score: 75,
        max_score: 94,
        description: 'Excellent',
    },
    {
        id: uuid(),
        label: 'B',
        min_score: 60,
        max_score: 74,
        description: 'Very Good',
    },
    {
        id: uuid(),
        label: 'C',
        min_score: 50,
        max_score: 59,
        description: 'Good',
    },
    {
        id: uuid(),
        label: 'D',
        min_score: 45,
        max_score: 49,
        description: 'Fair',
    },
    {
        id: uuid(),
        label: 'E',
        min_score: 40,
        max_score: 44,
        description: 'Poor',
    },
    {
        id: uuid(),
        label: 'F',
        min_score: 0,
        max_score: 39,
        description: 'Fail',
    },
];

const assessmentData = [
    {
        id: uuid(),
        name: '1st CA',
        max_score: 20
    },
    {
        id: uuid(),
        name: '2nd CA',
        max_score: 20
    },
    {
        id: uuid(),
        name: 'Exam',
        max_score: 60
    }
];

export function seedSettings(db: Database.Database) {
    const gradeRepo = new GradeRepository(db);
    const assessmentRepo = new AssessmentRepository(db);
    const settingRepo = new SettingRepository(db);

    gradeData.forEach((gradeSeed) => {
        const grade = new Grade({
            id: gradeSeed.id,
            grade: gradeSeed.label,
            minScore: gradeSeed.min_score,
            maxScore: gradeSeed.max_score,
            remark: gradeSeed.description
        });

        try {
            const result = gradeRepo.create(grade);
            if (result.changes > 0) {
                console.log(`Inserted grade: ${grade.grade}`);
            } else {
                console.log(`Grade not inserted: ${grade.grade}`);
            }
        } catch (e) {
            console.error(`Error inserting grade: ${grade.grade}`, e);
        }
    });

    assessmentData.forEach((assessmentSeed) => {
        const assessment = new Assessment({
            id: assessmentSeed.id,
            assessmentName: assessmentSeed.name,
            maxScore: assessmentSeed.max_score
        });

        try {
            const result = assessmentRepo.create(assessment);
            if (result.changes > 0) {
                console.log(`Inserted assessment: ${assessment.assessmentName}`);
            } else {
                console.log(`Assessment not inserted: ${assessment.assessmentName}`);
            }
        } catch (e) {
            console.error(`Error inserting assessment: ${assessment.assessmentName}`, e);
        }
    });

    const setting = new Setting({
        id: uuid(),
        schoolName: 'Kings and Queens Group of Schools, (Calvary Campus/ Okue) Ishiagu, Ivo LGA, Ebonyi State',
        term: 3,
        year: 2025
    });

    try {
        const result = settingRepo.create(setting);
        if (result.changes > 0) {
            console.log(`Inserted setting: ${setting.schoolName}`);
        } else {
            console.log(`Setting not inserted: ${setting.schoolName}`);
        }
    } catch (e) {
        console.error(`Error inserting setting: ${setting.schoolName}`, e);
    }
}

