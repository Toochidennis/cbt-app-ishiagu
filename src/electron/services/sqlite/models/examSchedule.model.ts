export class ExamSchedule {
    id?: string;
    description!: string;
    subjectId!: string;
    classId!: string;
    examDate!: string;
    time!: string;
    durationMinutes!: number;
    year!: number;
    term!: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<ExamSchedule>) {
        Object.assign(this, init);
    }
}
