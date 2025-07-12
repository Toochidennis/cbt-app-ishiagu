import {
    AssessmentsSync,
    ClassesSync,
    CourseAssignmentsSync,
    CourseRegistrationsSync,
    ExamAttemptsSync,
    ExamSchedulesSync,
    GradesSync,
    QuestionsSync,
    ResultsSync,
    SettingsSync,
    SubjectsSync,
    UsersSync
} from ".";

export class MasterSync {
    static async pullAll() {
        await ClassesSync.pullOnlineToOffline();
        await SubjectsSync.pullOnlineToOffline();
        await SettingsSync.pullOnlineToOffline();
        await GradesSync.pullOnlineToOffline();
        await UsersSync.pullOnlineToOffline();
        await AssessmentsSync.pullOnlineToOffline();
        await CourseAssignmentsSync.pullOnlineToOffline();
        await CourseRegistrationsSync.pullOnlineToOffline();
        await ExamSchedulesSync.pullOnlineToOffline();
        await QuestionsSync.pullOnlineToOffline();
        await ResultsSync.pullOnlineToOffline();
        await ExamAttemptsSync.pullOnlineToOffline();
    }

    static async pushAll() {
        await ClassesSync.pushOfflineToOnline();
        await SubjectsSync.pushOfflineToOnline();
        await SettingsSync.pushOfflineToOnline();
        await GradesSync.pullOnlineToOffline();
        await UsersSync.pushOfflineToOnline();
        await AssessmentsSync.pushOfflineToOnline();
        await CourseAssignmentsSync.pushOfflineToOnline();
        await CourseRegistrationsSync.pushOfflineToOnline();
        await ExamSchedulesSync.pushOfflineToOnline();
        await QuestionsSync.pushOfflineToOnline();
        await ResultsSync.pushOfflineToOnline();
        await ExamAttemptsSync.pushOfflineToOnline();
    }
}
