export class CourseRegistration {
    id!: string;
    studentId!: string;
    subjectId!: string;
    term!: number;
    year!: number;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<CourseRegistration>) {
        Object.assign(this, init);
    }
}
