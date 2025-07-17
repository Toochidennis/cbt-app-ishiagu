import { ipcMain, type IpcMainInvokeEvent } from 'electron';
import {
    Class,
    CourseAssignment,
    CourseRegistration,
    ExamSchedule,
    Question,
    Result,
    Subject,
    User,
    ExamAttempt
} from '../electron/services/sqlite/models'
import { type CreateQuestion, type CreateUser, type IpcChannels } from '../types/ipc/ipcTypes'
import type { DatabaseManager } from './services/sqlite/databaseManager';
import { v4 as uuid } from 'uuid';

export class IPCHandler {
    private dbManager: DatabaseManager;

    constructor(dbManager: DatabaseManager) {
        this.dbManager = dbManager;
    }

    public expose() {
        const now = new Date().toISOString();

        const channels: Partial<{
            [K in keyof IpcChannels]: (
                event: IpcMainInvokeEvent,
                data: IpcChannels[K]['input']
            ) => Promise<IpcChannels[K]['result']>
        }> = {
            'class:create': async (_e, data) => {
                const model = new Class({ id: uuid(), ...data, updatedAt: now });
                const result = this.dbManager.classRepo.create(model);
                return { id: model.id, changes: result.changes };
            },
            'class:get': async () => {
                const result = this.dbManager.classRepo.findAll();
                return { data: result, count: result.length };
            },
            'course-assignment:create': async (_e, data) => {
                const model = new CourseAssignment({ id: uuid(), ...data, updatedAt: now });
                const result = this.dbManager.courseAssignmentRepo.create(model);
                return { id: model.id, changes: result.changes };
            },
            'course-registration:create': async (_e, data) => {
                const model = new CourseRegistration({ id: uuid(), ...data, updatedAt: now });
                const result = this.dbManager.courseRegRepo.create(model);
                return { id: model.id!, changes: result.changes };
            },
            'course-registration:create-many': async (_e, data: CourseRegistration[]) => {
                const models = data.map(item => new CourseRegistration({
                    id: uuid(),
                    ...item,
                    updatedAt: now
                }));

                const results = this.dbManager.courseRegRepo.createMany(models);

                return { id: results[0].id, changes: results[0].changes };
            },
            'exam-schedule:create': async (_e, data) => {
                const model = new ExamSchedule({ id: uuid(), ...data, updatedAt: now });
                const result = this.dbManager.examScheduleRepo.create(model);
                return { id: model.id!, changes: result.changes };
            },
            'exam-schedule:get': async (_e, { classId, term, year }) => {
                return { data: this.dbManager.examScheduleRepo.findBySession(classId, term, year) };
            },
            'question:create': async (_e, data) => {
                const model = new Question({ id: uuid(), ...data, updatedAt: now });
                const result = this.dbManager.questionRepo.create(model);
                return { id: model.id!, changes: result.changes };
            },
            'question:create-many': async (_e, data: CreateQuestion[]) => {
                const models = data.map(question => new Question({
                    id: uuid(),
                    ...question,
                    updatedAt: now
                }));

                const results = this.dbManager.questionRepo.createMany(models);

                return { id: results[0].id, changes: results[0].changes };
            },
            'question:get': async (_e, { examScheduleId }) => {
                return { data: this.dbManager.questionRepo.findByExam(examScheduleId) };
            },
            'subject:create': async (_e, data) => {
                const model = new Subject({ id: uuid(), ...data, updatedAt: now });
                const result = this.dbManager.subjectRepo.create(model);
                return { id: model.id, changes: result.changes };
            },
            'subject:get': async () => {
                const result = this.dbManager.subjectRepo.findAll();
                return { data: result, count: result.length };
            },
            'user:create': async (_e, data) => {
                const model = new User({ id: uuid(), ...data, updatedAt: now });
                const result = this.dbManager.userRepo.create(model);
                return { id: model.id!, changes: result.changes };
            },
            'user:create-many': async (_e, data: CreateUser[]) => {
                const models = data.map(item => new User({
                    id: uuid(),
                    ...item
                }));

                const results = this.dbManager.userRepo.createMany(models);

                return { id: `${results.length}`, changes: results[0].changes };
            },
            'user:get': async (_e, classId) => {
                return { data: this.dbManager.userRepo.findByClassId(classId) };
            },
            'user:login': async (_e, { username, password }) => {
                const user = this.dbManager.userRepo.findByUsername(username);
                console.log(user);
                if (!user) return { data: [], error: 'User not found' }

                const isValid = password === user.passwordHash;
                if (!isValid) return { data: [], error: "Invalid password" };

                return { data: user };
            },
            'result:create': async (_e, data) => {
                const model = new Result({ id: uuid(), ...data });
                const result = this.dbManager.resultRepo.create(model);
                return { id: model.id, changes: result.changes };
            },
            'result:get': async (_e, { classId }) => {
                return { data: this.dbManager.resultRepo.findByClass(classId!) };
            },
            'setting:get': async () => {
                return { data: this.dbManager.settingRepo.getCurrent() };
            },
            'exam-attempt:create': async (_e, data) => {
                const model = new ExamAttempt({ id: uuid(), ...data });
                const result = this.dbManager.examAttemptRepo.create(model);
                return { id: model.id!, changes: result.changes };
            },
            'exam-attempt:get': async (_e, { studentId, examScheduleId }) => {
                return { data: this.dbManager.examAttemptRepo.findAttemptById(examScheduleId, studentId) };
            },
        };

        for (const [channel, handler] of Object.entries(channels)) {
            if (handler) {
                ipcMain.handle(channel, handler as any);
            }
        }
    }
}
