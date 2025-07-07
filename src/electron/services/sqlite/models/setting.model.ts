export class Setting {
    id!: string;
    schoolName?: string;
    logo?: string;
    term!: number;
    year!: number;
    createdAt?: string;
    updatedAt?: string;

    constructor(init?: Partial<Setting>) {
        Object.assign(this, init);
    }
}
