export type CourseResult = {
    studentName: string;
    regNo: string;
    resultId: string;
    totalScore: number;
    assessments: {
        assessment_name: string;
        score: number;
        max_score: number;
    }[];
};

export type RawRow = {
    studentId: string;
    username: string;
    studentName: string;
    resultId: string;
    totalScore: number;
    assessmentName: string;
    maxScore: number;
    score: number;
};