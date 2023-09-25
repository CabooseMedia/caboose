"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabooseScanner = void 0;
const events_1 = require("@caboose/events");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CabooseScanner {
    constructor(serverManager) {
        this.serverManager = serverManager;
    }
    scan() {
        const scannerManager = this.serverManager.getScannerManager();
        this.scanDirRecursive(scannerManager, this.serverManager.getContentDir());
    }
    startWatching() {
        throw new Error('Not implemented');
    }
    scanDir(scannerManager, dir) {
        const directoryContents = [];
        fs_1.default.readdirSync(dir).forEach(file => {
            const filePath = path_1.default.resolve(dir, file);
            const fileStats = fs_1.default.statSync(filePath);
            if (fileStats.isDirectory()) {
                scannerManager.emit(events_1.ScannerEvents.DIRECTORY_SCANNED, filePath);
            }
            else {
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
                extension: path_1.default.extname(filePath),
                isHidden: file.startsWith('.')
            });
        });
        return directoryContents;
    }
    scanDirRecursive(scannerManager, dir) {
        fs_1.default.readdirSync(dir).forEach(file => {
            const filePath = path_1.default.resolve(dir, file);
            if (fs_1.default.lstatSync(filePath).isDirectory()) {
                scannerManager.emit(events_1.ScannerEvents.DIRECTORY_SCANNED, filePath);
                this.scanDirRecursive(scannerManager, filePath);
            }
            else {
                this.scanFile(scannerManager, filePath);
            }
        });
    }
    scanFile(scannerManager, filePath) {
        if (!fs_1.default.existsSync(filePath)) {
            scannerManager.emit(events_1.ScannerEvents.FILE_NOT_FOUND, filePath);
            return;
        }
        const stats = fs_1.default.statSync(filePath);
        scannerManager.emit(events_1.ScannerEvents.FILE_SCANNED, filePath, stats);
        const extention = path_1.default.extname(filePath);
        switch (extention) {
            case '.mp4':
                scannerManager.emit(events_1.ScannerEvents.MP4_FILE_SCANNED, filePath, stats);
                break;
            default:
                break;
        }
    }
}
exports.CabooseScanner = CabooseScanner;
