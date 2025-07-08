export interface CreateResults {
    id?: string;
    studentId: string;
    subjectId: string;
    classId: string;
    term: number;
    year: number;
    ca1?: number;
    ca2?: number;
    exam?: number;
    totalScore?: number;
    grade?: string;
    remarks?: string;
    approved?: number; // 0 or 1
    approvedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAssessment {
    id?: string;
    subjectId?: string;
    classId?: string;
    assessmentName: string;
    maxScore: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateClass {
    id?: string;
    name: string;
    formTeacher?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCourseAssignment {
    id?: string;
    staffId: string;
    subjectId: string;
    classId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCourseRegistration {
    id?: string;
    studentId: string;
    subjectId: string;
    term: number;
    year: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateExamSchedule {
    id?: string;
    description: string;
    subjectId?: string;
    classId?: string;
    examDate: string;
    durationMinutes: number;
    year: number;
    term: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateGrade {
    grade: string;
    minScore: number;
    maxScore: number;
    remark: string;
}

export interface CreateQuestion {
    id?: string;
    examScheduleId: string;
    questionText: string;
    options: string;
    correctOption: string;
    marks?: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSubject {
    id?: string;
    code: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateUser {
    id?: string;
    displayId?: number;
    regNumber: string;
    role: 'admin' | 'staff' | 'student';
    surname: string;
    firstName: string;
    middleName?: string;
    classId: string;
    gender: 'male' | 'female';
    dateOfBirth?: string;
    contact?: string;
    state?: string;
    lga?: string;
    address?: string;
    username: string;
    passwordHash: string;
    isActive?: number; // 0 or 1
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateResult {
    id: string;
    changes: number;
}

/**
 * Map of channel → input and output types
 */
export interface IpcChannels {
    'assessment:create': {
        input: CreateAssessment;
        result: CreateResult;
    };

    'class:create': {
        input: CreateClass;
        result: CreateResult;
    };

    'course-assignment:create': {
        input: CreateCourseAssignment;
        result: CreateResult;
    };

    'course-registration:create': {
        input: CreateCourseRegistration;
        result: CreateResult;
    };

    'exam-schedule:create': {
        input: CreateExamSchedule;
        result: CreateResult;
    };

    'grade:create': {
        input: CreateGrade;
        result: CreateResult;
    };

    'question:create': {
        input: CreateQuestion;
        result: CreateResult;
    };

    'subject:create': {
        input: CreateSubject;
        result: CreateResult;
    };

    'user:create': {
        input: CreateUser;
        result: CreateResult;
    };

    'result:create': {
        input: CreateResults;
        result: CreateResult;
    };
}
