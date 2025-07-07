
export class Subject {
    id!: string;
    code!: string;
    name!: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<Subject>) {
        Object.assign(this, init);
    }
}