import { ExamSchedule } from "./examSchedule.model";

export class ExamScheduleWithSubject extends ExamSchedule {
    subjectName!: string;

    constructor(init?: Partial<ExamScheduleWithSubject>) {
        super(init);
        Object.assign(this, init)
    }
}