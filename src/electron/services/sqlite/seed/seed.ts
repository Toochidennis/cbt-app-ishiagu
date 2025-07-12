import { v4 as uuid } from 'uuid';
import { Subject, Class, Assessment, Grade, Setting } from "../models";
import Database from 'better-sqlite3';
import { SubjectRepository, ClassRepository, AssessmentRepository, GradeRepository, SettingRepository, UserRepository } from "../repositories";

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

const classData = [
    { id: uuid(), name: 'JSS1' },
    { id: uuid(), name: 'JSS2' },
    { id: uuid(), name: 'JSS3' },
    { id: uuid(), name: 'SSS1' },
    { id: uuid(), name: 'SSS2' },
    { id: uuid(), name: 'SSS3' },
]

const subjects = [
    { id: uuid(), name: "Accounting", code: "ACC" },
    { id: uuid(), name: "Agricultural Science", code: "AGR" },
    { id: uuid(), name: "Asusu Igbo", code: "ASU" },
    { id: uuid(), name: "Basic Technology", code: "BTE" },
    { id: uuid(), name: "Basic Science", code: "BSC" },
    { id: uuid(), name: "Biology", code: "BIO" },
    { id: uuid(), name: "Business Studies", code: "BST" },
    { id: uuid(), name: "Cultural and Creative Arts", code: "CCA" },
    { id: uuid(), name: "Chemistry", code: "CHE" },
    { id: uuid(), name: "Civic Education", code: "CIV" },
    { id: uuid(), name: "Commerce", code: "COM" },
    { id: uuid(), name: "Computer Science", code: "CPT" },
    { id: uuid(), name: "Christian Religious Studies", code: "CRS" },
    { id: uuid(), name: "Economics", code: "ECO" },
    { id: uuid(), name: "English Language", code: "ENG" },
    { id: uuid(), name: "Geography", code: "GEO" },
    { id: uuid(), name: "Government", code: "GOV" },
    { id: uuid(), name: "Home Economics", code: "HEC" },
    { id: uuid(), name: "Literature in English", code: "LIT" },
    { id: uuid(), name: "Mathematics", code: "MAT" },
    { id: uuid(), name: "Physical and Health Education", code: "PHE" },
    { id: uuid(), name: "Social Studies", code: "SOS" }
];


export function seedSettings(db: Database.Database) {
    const gradeRepo = new GradeRepository(db);
    const assessmentRepo = new AssessmentRepository(db);
    const settingRepo = new SettingRepository(db);
    const classRepo = new ClassRepository(db);
    const subjectRepo = new SubjectRepository(db);

    classData.forEach((classSeed) => {
        const clas = new Class({
            id: classSeed.id,
            name: classSeed.name,
        });

        try {
            const result = classRepo.create(clas);
            if (result.changes > 0) {
                console.log(`Inserted class: ${clas.name}`);
            } else {
                console.log(`Class not inserted: ${clas.name}`);
            }
        } catch (e) {
            console.error(`Error inserting class: ${clas.name}`, e);
        }
    });

    subjects.forEach((seed) => {
        const sub = new Subject({
            id: seed.id,
            name: seed.name,
            code: seed.code
        });

        try {
            const result = subjectRepo.create(sub);
            if (result.changes > 0) {
                console.log(`Inserted sub: ${sub.name}`);
            } else {
                console.log(`sub not inserted: ${sub.name}`);
            }
        } catch (e) {
            console.error(`Error inserting sub: ${sub.name}`, e);
        }
    });

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

