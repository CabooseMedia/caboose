"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
const events_1 = require("@caboose/events");
const _logger_1 = __importDefault(require("@logger"));
const path_1 = __importDefault(require("path"));
const events_2 = require("events");
class FileManager extends events_2.EventEmitter {
    constructor(serverManager) {
        super();
        _logger_1.default.debug(`FileManager initializing`);
        this.serverManager = serverManager;
        this._initOnScannerEvent(serverManager.getScannerManager());
    }
    getDirectoryContents(directoryPath) {
        const scannerManager = this.serverManager.getScannerManager();
        const scanPath = path_1.default.join(this.serverManager.getContentDir(), directoryPath);
        _logger_1.default.debug(`Scanning directory [${this.serverManager.getContentDir()}]`);
        _logger_1.default.debug(`Scanning directory [${scanPath}]`);
        const directoryContents = scannerManager.scanDir(scanPath);
        return directoryContents;
    }
    _initOnScannerEvent(scannerManager) {
        scannerManager.on(events_1.ScannerEvents.SCAN_STARTED, () => {
            _logger_1.default.debug(`Scan started`);
        });
        scannerManager.on(events_1.ScannerEvents.FILE_SCANNED, (file, stats) => {
            //logger.debug(`File scanned [${file}] [${JSON.stringify(stats)}]`);
            const databaseManager = this.serverManager.getDatabaseManager();
            databaseManager.upsertFile(file);
        });
        scannerManager.on(events_1.ScannerEvents.MP4_FILE_SCANNED, (file) => {
            //logger.debug(`MP4 file scanned [${file}]`);
        });
        scannerManager.on(events_1.ScannerEvents.DIRECTORY_SCANNED, (dir) => {
            //logger.debug(`Directory scanned [${dir}]`);
        });
        scannerManager.on(events_1.ScannerEvents.FILE_NOT_FOUND, (file) => {
            //logger.debug(`File not found [${file}]`);
        });
        scannerManager.on(events_1.ScannerEvents.SCAN_COMPLETED, () => {
            _logger_1.default.debug(`Scan completed`);
        });
    }
}
exports.FileManager = FileManager;
