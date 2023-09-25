"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerManager = void 0;
const _logger_1 = __importDefault(require("@logger"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const managers_1 = require("@caboose/managers");
class ServerManager {
    constructor() {
        _logger_1.default.debug(`ServerManager initializing`);
        this.rootDir = path_1.default.resolve(__dirname, '..', '..', '..');
        this.contentDir = path_1.default.resolve(this.rootDir, 'content');
        this.dataDir = path_1.default.resolve(this.rootDir, 'data');
        this.os = {
            platform: os_1.default.platform(),
            arch: os_1.default.arch(),
            release: os_1.default.release(),
            type: os_1.default.type(),
        };
        this.scannerManager = new managers_1.ScannerManager(this);
        this.fileManager = new managers_1.FileManager(this);
        this.databaseManager = new managers_1.DatabaseManager(this);
        this.downloadManager = new managers_1.DownloadManager(this);
        this.pluginManager = new managers_1.PluginManager(this);
        this._runManagerStartupTasks();
    }
    _runManagerStartupTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.databaseManager.deploy();
            this.scannerManager.start();
            this.scannerManager.scan();
        });
    }
    getRootDir() {
        return this.rootDir;
    }
    getContentDir() {
        return this.contentDir;
    }
    getDataDir() {
        return this.dataDir;
    }
    getOS() {
        return this.os;
    }
    getScannerManager() {
        return this.scannerManager;
    }
    getFileManager() {
        return this.fileManager;
    }
    getDatabaseManager() {
        return this.databaseManager;
    }
    getDownloadManager() {
        return this.downloadManager;
    }
    getPluginManager() {
        return this.pluginManager;
    }
}
exports.ServerManager = ServerManager;
