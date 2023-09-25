import { ServerManager, ScannerManager } from '@caboose/managers';
import { ScannerEvents } from '@caboose/enums';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import logger from '@logger';
import { CabooseScanner } from './CabooseScanner';

export class WindowsScanner extends CabooseScanner {

    public startWatching(){

        // debating whether to use chokidar or create a custom watcher
        // since a custom watcher needs to be made for linux anyway

        // thinking of making my own, but for now chokidar will do

        // fs.watch(this.serverManager.getContentDir(), { recursive: true }, (event, filename) => {
        //     logger.debug(event);
        //     logger.debug(filename);
        // });

        const scanner = this.serverManager.getScannerManager();

        chokidar.watch(this.serverManager.getContentDir(), {
            awaitWriteFinish: true,
            ignoreInitial: true
        }).on('all', (event, path) => {
            scanner.scanFile(path);
            logger.debug(event, path);
        });
    }

}