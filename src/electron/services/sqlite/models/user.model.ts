export class User {
    id!: string;
    displayId?: number;
    regNumber!: string;
    role!: 'admin' | 'staff' | 'student';
    surname!: string;
    firstName!: string;
    middleName?: string;
    classId?: string;
    gender?: 'male' | 'female';
    dateOfBirth?: string;
    contact?: string;
    state?: string;
    lga?: string;
    address?: string;
    username!: string;
    passwordHash!: string;
    isActive?: number; // 0 or 1
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}