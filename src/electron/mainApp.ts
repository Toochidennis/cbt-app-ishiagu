import { IPCHandler } from "./ipcHandler";
import { DatabaseManager } from "./services/sqlite/databaseManager";
import { SyncService } from "./services/sync";
import { WindowManager } from "./windowManager";
import { UpdaterService } from "./services/updater/updateService";


export class MainApp {
    private windowManager: WindowManager;
    private dbManager: DatabaseManager;
    private syncService: SyncService;
    private ipcHandler: IPCHandler;
    private updaterService: UpdaterService;

    constructor() {
        this.windowManager = new WindowManager();
        this.dbManager = new DatabaseManager();
        this.syncService = new SyncService();
        this.ipcHandler = new IPCHandler(this.dbManager);
        this.updaterService = new UpdaterService(60 * 60 * 1000);
    }

    public async init() {
        await this.dbManager.init();

        await this.syncService.runFullSync();
        this.syncService.startInterval();
        // for (let i = 220; i <= 270; i++) {
        //     const timestamp = `2025-07-20T06:24:20.${i.toString().padStart(3, '0')}Z`;
        //     this.dbManager.courseRegRepo.delete(timestamp);
        // }

         console.log(this.dbManager.courseRegRepo.findAll());

        this.updaterService.checkNow();
        this.updaterService.startInterval();

        this.windowManager.createWindow();
        this.ipcHandler.expose();
    }

    public activate() {
        if (!this.windowManager.hasWindow()) {
            this.windowManager.createWindow();
        }
    }

    public focusWindow() {
        this.windowManager.focus();
    }
}
