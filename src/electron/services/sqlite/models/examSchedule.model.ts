export class ExamSchedule {
    id!: string;
    description!: string;
    subjectId?: string;
    classId?: string;
    examDate!: string;
    durationMinutes!: number;
    year!: number;
    term!: number;
    createdBy?: string;
    createdAt?: string;
}
