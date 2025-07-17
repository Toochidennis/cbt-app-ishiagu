import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { dialog } from 'electron';

export class UpdaterService {
    private intervalMs: number;

    constructor(intervalMs = 60 * 60 * 1000) {
        this.intervalMs = intervalMs;
        log.transports.file.level = 'info';
        autoUpdater.logger = log

        this.registerListeners();
    }

    private registerListeners() {
        autoUpdater.on('update-available', () => {
            log.info('Update available');
        });

        autoUpdater.on('update-not-available', () => {
            log.info('No update available');
        });

        autoUpdater.on('error', (err) => {
            log.error('Error during update:', err);
        });

        autoUpdater.on('download-progress', (progress) => {
            log.info(`Download progress: ${progress.percent}%`);
        });

        autoUpdater.on('update-downloaded', () => {
            log.info('Update downloaded');
            dialog.showMessageBox({
                type: 'info',
                title: 'Update available',
                message: 'A new version has been downloaded. Restart the application to apply the updates.',
                buttons: ['Restart', 'Later'],
            }).then((result) => {
                if (result.response === 0) {
                    autoUpdater.quitAndInstall();
                }
            });
        });
    }

    public checkNow() {
        autoUpdater.checkForUpdates();
    }

    public startInterval() {
        setInterval(() => {
            this.checkNow();
        }, this.intervalMs);
        log.info(`Updater interval started (every ${this.intervalMs / 60000} minutes).`);
    }
}
