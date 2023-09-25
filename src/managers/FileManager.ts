import { ScannerManager, ServerManager } from "@caboose/managers";
import { ScannerEvents } from "@caboose/enums";
import logger from "@logger";
import path from "path";

import { EventEmitter } from "events";

export class FileManager extends EventEmitter {

    private serverManager: ServerManager;

    constructor(serverManager: ServerManager) {
        super();
        
        logger.debug(`FileManager initializing`);

        this.serverManager = serverManager;

        this._initOnScannerEvent(serverManager.getScannerManager());

    }

    public getDirectoryContents(directoryPath: string): {
        name: string,
        path: string,
        isDirectory: boolean,
        size: number,
        createdAt: Date,
        updatedAt: Date,
        accessedAt: Date,
        extension: string,
        isHidden: boolean
    }[] {
        const scannerManager = this.serverManager.getScannerManager();
        const scanPath = path.join(this.serverManager.getContentDir(), directoryPath);
        logger.debug(`Scanning directory [${this.serverManager.getContentDir()}]`);
        logger.debug(`Scanning directory [${scanPath}]`);
        const directoryContents = scannerManager.scanDir(scanPath);
        return directoryContents;
    }

    private _initOnScannerEvent(scannerManager: ScannerManager): void {
        scannerManager.on(ScannerEvents.SCAN_STARTED, () => {
            logger.debug(`Scan started`);
        });

        scannerManager.on(ScannerEvents.FILE_SCANNED, (file: string, stats: object) => {
            //logger.debug(`File scanned [${file}] [${JSON.stringify(stats)}]`);

            const databaseManager = this.serverManager.getDatabaseManager();
            databaseManager.upsertFile(file);

        });

        scannerManager.on(ScannerEvents.MP4_FILE_SCANNED, (file: string) => {
            //logger.debug(`MP4 file scanned [${file}]`);
        });

        scannerManager.on(ScannerEvents.DIRECTORY_SCANNED, (dir: string) => {
            //logger.debug(`Directory scanned [${dir}]`);
        });

        scannerManager.on(ScannerEvents.FILE_NOT_FOUND, (file: string) => {
            //logger.debug(`File not found [${file}]`);
        });

        scannerManager.on(ScannerEvents.SCAN_COMPLETED, () => {
            logger.debug(`Scan completed`);
        });
    }

}