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
