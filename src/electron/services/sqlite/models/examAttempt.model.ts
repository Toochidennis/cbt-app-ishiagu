export class ExamAttempt {
    id?: string;
    examScheduleId!: string;
    studentId!: string;
    status!: 1 | 0;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<ExamAttempt>) {
        Object.assign(this, init);
    }
}
