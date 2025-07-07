export class Class {
    id!: string;
    name!: string;
    formTeacher?: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<Class>) {
        Object.assign(this, init);
    }
}