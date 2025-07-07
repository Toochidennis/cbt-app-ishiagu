export class Result {
    id!: string;
    studentId?: string;
    subjectId?: string;
    classId?: string;
    term!: number;
    year!: number;
    ca1?: number;
    ca2?: number;
    exam?: number;
    totalScore?: number;
    grade?: string;
    remarks?: string;
    approved!: number; // 0 or 1
    approvedAt?: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<Result>) {
        Object.assign(this, init);
    }
}
