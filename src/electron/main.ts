import { app, BrowserWindow, ipcMain, type IpcMainInvokeEvent } from 'electron';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { isDev } from './util/util';
import { getPreloadPath } from './util/pathResolver';
import { LocalDatabase } from './services/sqlite/Database';
import { type CreateSubject, type IpcChannels } from '../types/ipc/ipcTypes';
import {
    ClassRepository,
    CourseAssignmentRepository,
    CourseRegistrationRepository,
    ExamScheduleRepository,
    QuestionRepository,
    ResultRepository,
    SubjectRepository,
    UserRepository
} from './services/sqlite/repositories';

import {
    Class, CourseAssignment, CourseRegistration, ExamSchedule,
    Question, Result, Subject, User
} from './services/sqlite/models';
//import { seedSettings } from './services/sqlite/seed/seed';

let mainWindow: BrowserWindow;
let db: LocalDatabase;
let classRepo: ClassRepository;
let courseAssignmentRepo: CourseAssignmentRepository;
let courseRegRepo: CourseRegistrationRepository;
let examScheduleRepo: ExamScheduleRepository;
let questionRepo: QuestionRepository;
let subjectRepo: SubjectRepository;
let userRepo: UserRepository;
let resultRepo: ResultRepository;

app.on('ready', () => {
    db = new LocalDatabase();

    initRepos();
    //seedSettings(db.getConnection());

    mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation: true,
            preload: getPreloadPath(),
            nodeIntegration: false,
        }
    });

    mainWindow.setMenu(null);
    mainWindow.maximize();

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123')
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
});

exposeIpcHandlers();

function initRepos() {
    const connection = db.getConnection();

    classRepo = new ClassRepository(connection);
    courseAssignmentRepo = new CourseAssignmentRepository(connection);
    courseRegRepo = new CourseRegistrationRepository(connection);
    examScheduleRepo = new ExamScheduleRepository(connection);
    questionRepo = new QuestionRepository(connection);
    subjectRepo = new SubjectRepository(connection);
    userRepo = new UserRepository(connection);
    resultRepo = new ResultRepository(connection);
}

function exposeIpcHandlers() {
    const channels: Partial<{
        [K in keyof IpcChannels]: (
            event: IpcMainInvokeEvent,
            data: IpcChannels[K]['input']
        ) => Promise<IpcChannels[K]['result']>
    }> = {
        'class:create': async (_e, data) => {
            const model = new Class({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = classRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'class:get': async () => {
            const result = classRepo.findAll();
            return { data: result, count: result.length };
        },
        'course-assignment:create': async (_e, data) => {
            const model = new CourseAssignment({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = courseAssignmentRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'course-registration:create': async (_e, data) => {
            const model = new CourseRegistration({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = courseRegRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'exam-schedule:create': async (_e, data) => {
            const model = new ExamSchedule({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = examScheduleRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'question:create': async (_e, data) => {
            const model = new Question({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = questionRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'subject:create': async (_e, data) => {
            const model = new Subject({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = subjectRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'subject:get': async () => {
            const result = subjectRepo.findAll();
            return { data: result, count: result.length };
        },
        'user:create': async (_e, data) => {
            const model = new User({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = userRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'result:create': async (_e, data) => {
            const model = new Result({ id: uuid(), ...data, updatedAt: new Date().toISOString() });
            const result = resultRepo.create(model);
            return { id: model.id, changes: result.changes };
        }
    };

    for (const [channel, handler] of Object.entries(channels)) {
        if (handler) {
            ipcMain.handle(channel, handler as any);
        }
    }
}
