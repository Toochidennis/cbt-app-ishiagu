
export class Question {
    id?: string;
    examScheduleId!: string;
    questionText!: string;
    options!: string;
    correctOption!: string;
    marks!: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<Question>) {
        Object.assign(this, init);
    }
}
