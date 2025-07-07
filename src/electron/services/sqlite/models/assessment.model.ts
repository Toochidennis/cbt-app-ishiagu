export class Assessment {
    id!: string;
    subjectId?: string;
    classId?: string;
    assessmentName!: string;
    maxScore!: number;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<Assessment>) {
        Object.assign(this, init);
    }
}