export class CourseAssignment {
    id!: string;
    staffId?: string;
    subjectId?: string;
    classId?: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<CourseAssignment>) {
        Object.assign(this, init);
    }
}