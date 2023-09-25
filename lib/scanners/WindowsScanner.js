"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowsScanner = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const _logger_1 = __importDefault(require("@logger"));
const CabooseScanner_1 = require("./CabooseScanner");
class WindowsScanner extends CabooseScanner_1.CabooseScanner {
    startWatching() {
        // debating whether to use chokidar or create a custom watcher
        // since a custom watcher needs to be made for linux anyway
        // thinking of making my own, but for now chokidar will do
        // fs.watch(this.serverManager.getContentDir(), { recursive: true }, (event, filename) => {
        //     logger.debug(event);
        //     logger.debug(filename);
        // });
        const scanner = this.serverManager.getScannerManager();
        chokidar_1.default.watch(this.serverManager.getContentDir(), {
            awaitWriteFinish: true,
            ignoreInitial: true
        }).on('all', (event, path) => {
            scanner.scanFile(path);
            _logger_1.default.debug(event, path);
        });
    }
}
exports.WindowsScanner = WindowsScanner;
