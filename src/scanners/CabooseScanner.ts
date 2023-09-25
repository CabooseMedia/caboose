import { ScannerManager, ServerManager } from "@caboose/managers";
import { ScannerEvents } from "@caboose/events";
import fs from "fs";
import path from "path";

export class CabooseScanner {

    protected serverManager: ServerManager;

    constructor(serverManager: ServerManager) {
        this.serverManager = serverManager;
    }

    public scan(): void {
        const scannerManager = this.serverManager.getScannerManager();
        this.scanDirRecursive(scannerManager, this.serverManager.getContentDir());
    }

    public startWatching(): void {
        throw new Error('Not implemented');
    }

    public scanDir(scannerManager: ScannerManager, dir: string): {
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
        const directoryContents: {
            name: string,
            path: string,
            isDirectory: boolean,
            size: number,
            createdAt: Date,
            updatedAt: Date,
            accessedAt: Date,
            extension: string,
            isHidden: boolean
        }[] = [];
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.resolve(dir, file);
            const fileStats = fs.statSync(filePath);
            if (fileStats.isDirectory()) {
                scannerManager.emit(ScannerEvents.DIRECTORY_SCANNED, filePath);
            } else {
                this.scanFile(scannerManager, filePath);
            }
            directoryContents.push({
                name: file,
                path: filePath,
                isDirectory: fileStats.isDirectory(),
                size: fileStats.size,
                createdAt: fileStats.birthtime,
                updatedAt: fileStats.mtime,
                accessedAt: fileStats.atime,
                extension: path.extname(filePath),
                isHidden: file.startsWith('.')
            });
        });
        return directoryContents;
    }

    public scanDirRecursive(scannerManager: ScannerManager, dir: string): void {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.resolve(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                scannerManager.emit(ScannerEvents.DIRECTORY_SCANNED, filePath);
                this.scanDirRecursive(scannerManager, filePath);
            } else {
                this.scanFile(scannerManager, filePath);
            }
        });
    }

    public scanFile(scannerManager: ScannerManager, filePath: string): void {
        if (!fs.existsSync(filePath)) {
            scannerManager.emit(ScannerEvents.FILE_NOT_FOUND, filePath);
            return;
        }
        const stats = fs.statSync(filePath);
        scannerManager.emit(ScannerEvents.FILE_SCANNED, filePath, stats);
        const extention = path.extname(filePath);
        switch (extention) {
            case '.mp4':
                scannerManager.emit(ScannerEvents.MP4_FILE_SCANNED, filePath, stats);
                break;
            default:
                break;
        }
    }
}