import { app, BrowserWindow, ipcMain, net, type IpcMainInvokeEvent } from 'electron';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { isDev } from './util/util';
import { getPreloadPath } from './util/pathResolver';
import { LocalDatabase } from './services/sqlite/Database';
import { type CreateQuestion, type CreateUser, type IpcChannels } from '../types/ipc/ipcTypes';
import { MasterSync } from './services/sync';
import {
    ClassRepository,
    CourseAssignmentRepository,
    CourseRegistrationRepository,
    ExamScheduleRepository,
    QuestionRepository,
    ResultRepository,
    SubjectRepository,
    UserRepository,
    SettingRepository,
    ExamAttemptRepository
} from './services/sqlite/repositories';

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
} from './services/sqlite/models';
import { seedSettings } from './services/sqlite/seed/seed';

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
let settingRepo: SettingRepository;
let examAttemptRepo: ExamAttemptRepository;

const now = new Date().toISOString();

app.on('ready', async () => {
    db = new LocalDatabase();

    initRepos();

    await runFullSync();
    startSyncInterval();
   // seedSettings(db.getConnection());

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

// app.on('browser-window-focus', async () => {
//     await runFullSync();
// });


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
    settingRepo = new SettingRepository(connection);
    examAttemptRepo = new ExamAttemptRepository(connection);
}

function exposeIpcHandlers() {
    const channels: Partial<{
        [K in keyof IpcChannels]: (
            event: IpcMainInvokeEvent,
            data: IpcChannels[K]['input']
        ) => Promise<IpcChannels[K]['result']>
    }> = {
        'class:create': async (_e, data) => {
            const model = new Class({ id: uuid(), ...data, updatedAt: now });
            const result = classRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'class:get': async () => {
            const result = classRepo.findAll();
            return { data: result, count: result.length };
        },
        'course-assignment:create': async (_e, data) => {
            const model = new CourseAssignment({ id: uuid(), ...data, updatedAt: now });
            const result = courseAssignmentRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'course-registration:create': async (_e, data) => {
            const model = new CourseRegistration({ id: uuid(), ...data, updatedAt: now });
            const result = courseRegRepo.create(model);
            return { id: model.id!, changes: result.changes };
        },
        'course-registration:create-many': async (_e, data: CourseRegistration[]) => {
            const models = data.map(item => new CourseRegistration({
                id: uuid(),
                ...item,
                updatedAt: now
            }));

            const results = courseRegRepo.createMany(models);

            return { id: results[0].id, changes: results[0].changes };
        },
        'exam-schedule:create': async (_e, data) => {
            const model = new ExamSchedule({ id: uuid(), ...data, updatedAt: now });
            const result = examScheduleRepo.create(model);
            return { id: model.id!, changes: result.changes };
        },
        'exam-schedule:get': async (_e, { classId, term, year }) => {
            return { data: examScheduleRepo.findBySession(classId, term, year) };
        },
        'question:create': async (_e, data) => {
            const model = new Question({ id: uuid(), ...data, updatedAt: now });
            const result = questionRepo.create(model);
            return { id: model.id!, changes: result.changes };
        },
        'question:create-many': async (_e, data: CreateQuestion[]) => {
            const models = data.map(question => new Question({
                id: uuid(),
                ...question,
                updatedAt: now
            }));

            const results = questionRepo.createMany(models);

            return { id: results[0].id, changes: results[0].changes };
        },
        'question:get': async (_e, { examScheduleId }) => {
            return { data: questionRepo.findByExam(examScheduleId) };
        },
        'subject:create': async (_e, data) => {
            const model = new Subject({ id: uuid(), ...data, updatedAt: now });
            const result = subjectRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'subject:get': async () => {
            const result = subjectRepo.findAll();
            return { data: result, count: result.length };
        },
        'user:create': async (_e, data) => {
            const model = new User({ id: uuid(), ...data, updatedAt: now });
            const result = userRepo.create(model);
            return { id: model.id!, changes: result.changes };
        },
        'user:create-many': async (_e, data: CreateUser[]) => {
            const models = data.map(item => new User({
                id: uuid(),
                ...item
            }));

            const results = userRepo.createMany(models);

            return { id: `${results.length}`, changes: results[0].changes };
        },
        'user:get': async (_e, classId) => {
            return { data: userRepo.findByClassId(classId) };
        },
        'user:login': async (_e, { username, password }) => {
            const user = userRepo.findByUsername(username);
            console.log(user);
            if (!user) return { data: [], error: 'User not found' }

            const isValid = password === user.passwordHash;
            if (!isValid) return { data: [], error: "Invalid password" };

            return { data: user };
        },
        'result:create': async (_e, data) => {
            const model = new Result({ id: uuid(), ...data });
            const result = resultRepo.create(model);
            return { id: model.id, changes: result.changes };
        },
        'result:get': async (_e, { classId }) => {
            return { data: resultRepo.findByClass(classId!) };
        },
        'setting:get': async () => {
            return { data: settingRepo.getCurrent() };
        },
        'exam-attempt:create': async (_e, data) => {
            const model = new ExamAttempt({ id: uuid(), ...data });
            const result = examAttemptRepo.create(model);
            return { id: model.id!, changes: result.changes };
        },
        'exam-attempt:get': async (_e, { studentId, examScheduleId }) => {
            return { data: examAttemptRepo.findAttemptById(examScheduleId, studentId) };
        },
    };

    for (const [channel, handler] of Object.entries(channels)) {
        if (handler) {
            ipcMain.handle(channel, handler as any);
        }
    }
}

async function isOnline(): Promise<boolean> {
    return new Promise((resolve) => {
        const request = net.request("https://www.google.com");
        request.on("response", () => resolve(true));
        request.on("error", () => resolve(false));
        request.end();
    });
}

async function runFullSync() {
    console.log("🌐 Checking connectivity...");
    const online = await isOnline();

    if (!online) {
        console.log("⚠ No internet connection. Skipping sync.");
        return;
    }

    console.log("⏳ Starting FULL SYNC...");

    try {
        await MasterSync.pullAll();
        await MasterSync.pushAll();

        console.log("✅ Sync completed successfully!");
    } catch (error) {
        console.error("❌ Sync failed:", error);
    }
}


function startSyncInterval() {
    const intervalMillis = 15 * 60 * 1000;

    setInterval(() => {
        runFullSync();
    }, intervalMillis);

    console.log(`🔄 Sync interval started: every ${intervalMillis / 60000} minutes`);
}
