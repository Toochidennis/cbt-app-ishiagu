export type CourseResult = {
    studentName: string;
    regNo: string;
    resultId: string;
    totalScore: number;
    grade?: string;
    assessments: {
        assessmentName: string;
        score: number;
        maxScore: number;
    }[];
};

export type RawRow = {
    studentId: string;
    username: string;
    studentName: string;
    resultId: string;
    ca1: number;
    ca2: number;
    exam: number;
    totalScore: number;
};