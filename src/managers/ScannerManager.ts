import logger from "@logger";
import path from "path";
import os from "os";

import { EventEmitter } from 'events';

import { CabooseScanner, LinuxScanner, WSLScanner, WindowsScanner } from "@caboose/scanners";
import { ServerManager } from "@caboose/managers";
import { ScannerEvents } from "@caboose/events";

export class ScannerManager extends EventEmitter {

    private serverManager: ServerManager;
    private scanner: CabooseScanner;

    constructor(serverManager: ServerManager) {
        super();

        logger.debug(`ScannerManager initializing`);

        this.serverManager = serverManager;

        const os = this.serverManager.getOS();

        const isWSL = os.platform === 'linux' && os.release.includes('microsoft');

        if (isWSL) {
            logger.debug(`Using WSLScanner [${os.platform} ${os.release}]`);
            this.scanner = new WSLScanner(serverManager);
        } else if (os.platform === 'linux') {
            logger.debug(`Using LinuxScanner [${os.platform} ${os.release}]`);
            this.scanner = new LinuxScanner(serverManager);
        } else if (os.platform === 'win32') {
            logger.debug(`Using WindowsScanner [${os.platform} ${os.release}]`);
            this.scanner = new WindowsScanner(serverManager);
        } else {
            throw new Error(`Unsupported operating system [${os.platform} ${os.release}]`);
        }

        logger.debug(`ScannerManager initialized`);
    }

    public start(): void {
        this.scanner.startWatching();
    }

    public scan(): void {
        this.emit(ScannerEvents.SCAN_STARTED);

        this.scanner.scan();

        this.emit(ScannerEvents.SCAN_COMPLETED);
    }

    public scanDir(dir: string): {
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
        return this.scanner.scanDir(this, dir);
    }

    public scanFile(filePath: string): void {
        this.scanner.scanFile(this, filePath);
    }

}

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