export class Grade {
    id!: string;
    grade!: string;
    minScore!: number;
    maxScore!: number;
    remark?: string;
    updatedAt?: string;

    constructor(init?: Partial<Grade>) {
        Object.assign(this, init);
    }
}
