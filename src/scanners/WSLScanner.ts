import { ServerManager, ScannerManager } from '@caboose/managers';
import { ScannerEvents } from '@caboose/enums';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import logger from '@logger';
import { CabooseScanner } from './CabooseScanner';

export class WSLScanner extends CabooseScanner {

    public startWatching(){
        chokidar.watch(this.serverManager.getContentDir(), {
            awaitWriteFinish: true,
            ignoreInitial: true,
            usePolling: true
        }).on('all', (event, path) => {
            logger.debug(event, path);
        });
    }

}