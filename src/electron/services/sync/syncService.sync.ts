import { net } from "electron";
import { MasterSync } from "./master.sync";


export class SyncService {
    private intervalMillis = 5 * 60 * 1000;

    constructor() { }

    public async runFullSync() {
        const online = await this.isOnline();
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

    public startInterval() {
        setInterval(() => {
            this.runFullSync();
        }, this.intervalMillis);

        console.log(
            `🔄 Sync interval started: every ${this.intervalMillis / 60000} minutes`
        );
    }

    private async isOnline(): Promise<boolean> {
        return new Promise((resolve) => {
            const request = net.request("https://www.google.com");
            request.on("response", () => resolve(true));
            request.on("error", () => resolve(false));
            request.end();
        });
    }
}
