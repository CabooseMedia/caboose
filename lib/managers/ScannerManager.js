"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerManager = void 0;
const _logger_1 = __importDefault(require("@logger"));
const events_1 = require("events");
const scanners_1 = require("@caboose/scanners");
const events_2 = require("@caboose/events");
class ScannerManager extends events_1.EventEmitter {
    constructor(serverManager) {
        super();
        _logger_1.default.debug(`ScannerManager initializing`);
        this.serverManager = serverManager;
        const os = this.serverManager.getOS();
        const isWSL = os.platform === 'linux' && os.release.includes('microsoft');
        if (isWSL) {
            _logger_1.default.debug(`Using WSLScanner [${os.platform} ${os.release}]`);
            this.scanner = new scanners_1.WSLScanner(serverManager);
        }
        else if (os.platform === 'linux') {
            _logger_1.default.debug(`Using LinuxScanner [${os.platform} ${os.release}]`);
            this.scanner = new scanners_1.LinuxScanner(serverManager);
        }
        else if (os.platform === 'win32') {
            _logger_1.default.debug(`Using WindowsScanner [${os.platform} ${os.release}]`);
            this.scanner = new scanners_1.WindowsScanner(serverManager);
        }
        else {
            throw new Error(`Unsupported operating system [${os.platform} ${os.release}]`);
        }
        _logger_1.default.debug(`ScannerManager initialized`);
    }
    start() {
        this.scanner.startWatching();
    }
    scan() {
        this.emit(events_2.ScannerEvents.SCAN_STARTED);
        this.scanner.scan();
        this.emit(events_2.ScannerEvents.SCAN_COMPLETED);
    }
    scanDir(dir) {
        return this.scanner.scanDir(this, dir);
    }
    scanFile(filePath) {
        this.scanner.scanFile(this, filePath);
    }
}
exports.ScannerManager = ScannerManager;
// determine correct scanner to use based on operating system
// pass correct scanner to ScannerManager
/*

readings from SeaWolf

my laptop: Windows_NT 10.0.22621 win32
my laptop docker: Linux 5.10.102.1-microsoft-standard-WSL2 linux
my server: Linux 5.15.0-67-generic linux

*/
// release and platform are the most important
/*

hey smorbis create a server manager and just export the classes instead of creating the instances in the file
make an alias for @caboose/managers and then export all of the managers from there
server manager will be the only one that creates instances of the managers

*/ 
