import logger from "@logger";
import path from "path";
import os from "os";

import { ScannerManager, FileManager, DatabaseManager, DownloadManager, PluginManager } from "@caboose/managers";

export class ServerManager {

    private rootDir: string;
    private contentDir: string;
    private dataDir: string;

    private os: {
        platform: NodeJS.Platform;
        arch: string;
        release: string;
        type: string;
    };

    private scannerManager: ScannerManager;
    private fileManager: FileManager;
    private databaseManager: DatabaseManager;
    private downloadManager: DownloadManager;
    private pluginManager: PluginManager;

    constructor() {
        logger.debug(`ServerManager initializing`);

        this.rootDir = path.resolve(__dirname, '..', '..', '..');
        this.contentDir = path.resolve(this.rootDir, 'content');
        this.dataDir = path.resolve(this.rootDir, 'data');

        this.os = {
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            type: os.type(),
        };

        this.scannerManager = new ScannerManager(this);
        this.fileManager = new FileManager(this);
        this.databaseManager = new DatabaseManager(this);
        this.downloadManager = new DownloadManager(this);
        this.pluginManager = new PluginManager(this);

        this._runManagerStartupTasks();

        
    }
    
    private async _runManagerStartupTasks(): Promise<void> {
        await this.databaseManager.deploy();
        this.scannerManager.start();
        this.scannerManager.scan();
    }

    public getRootDir(): string {
        return this.rootDir;
    }

    public getContentDir(): string {
        return this.contentDir;
    }

    public getDataDir(): string {
        return this.dataDir;
    }

    public getOS(): {
        platform: NodeJS.Platform;
        arch: string;
        release: string;
        type: string;
    } {
        return this.os;
    }

    public getScannerManager(): ScannerManager {
        return this.scannerManager;
    }

    public getFileManager(): FileManager {
        return this.fileManager;
    }

    public getDatabaseManager(): DatabaseManager {
        return this.databaseManager;
    }

    public getDownloadManager(): DownloadManager {
        return this.downloadManager;
    }

    public getPluginManager(): PluginManager {
        return this.pluginManager;
    }

}