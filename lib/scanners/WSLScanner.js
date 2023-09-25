"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSLScanner = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const _logger_1 = __importDefault(require("@logger"));
const CabooseScanner_1 = require("./CabooseScanner");
class WSLScanner extends CabooseScanner_1.CabooseScanner {
    startWatching() {
        chokidar_1.default.watch(this.serverManager.getContentDir(), {
            awaitWriteFinish: true,
            ignoreInitial: true,
            usePolling: true
        }).on('all', (event, path) => {
            _logger_1.default.debug(event, path);
        });
    }
}
exports.WSLScanner = WSLScanner;
