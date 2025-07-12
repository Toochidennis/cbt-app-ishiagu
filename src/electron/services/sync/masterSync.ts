import { UsersSync } from "./usersSync";


export class MasterSync {
    static async pullAll() {
        await UsersSync.pullOnlineToOffline();
        // await ClassesSync.pullOnlineToOffline();
        // ...
    }

    static async pushAll() {
        await UsersSync.pushOfflineToOnline();
        // await ClassesSync.pushOfflineToOnline();
        // ...
    }
}
