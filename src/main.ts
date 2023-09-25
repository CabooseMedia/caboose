import 'dotenv/config';
import './util/alias';

import logger from '@logger';
import express from 'express';

import { ServerManager } from '@caboose/managers';

const server = express();

function init() {

    logger.debug(`Initializing server`);

    const serverManager = new ServerManager();

    startServer(serverManager);

}

function startServer(serverManager: ServerManager) {

    server.get('/api/v1/directory', (req, res) => {
        const directoryPath = req.query.path as string ?? "/";
        const directoryContents = serverManager.getFileManager().getDirectoryContents(directoryPath);
        res.json(directoryContents);
    });

    server.listen(process.env.CABOOSE_SERVER_PORT, () => {
        logger.info(`Server listening on port ${process.env.CABOOSE_SERVER_PORT}`);
        serverManager.getPluginManager().uninstallPlugin("https://github.com/HackboxGames/HackboxServer.git");
        serverManager.getPluginManager().installPlugin("https://github.com/MeAwesome/Awfully-Salty-Squid.git");
    });

}

init();