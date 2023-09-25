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
        //serverManager.getPluginManager().uninstallPlugin("https://github.com/HackboxGames/HackboxServer.git");
        //serverManager.getPluginManager().uninstallPlugin("https://raw.githubusercontent.com/CabooseMedia/caboose-plugin-filebrowser/main/manifest.json");
        serverManager.getPluginManager().installPlugin("https://raw.githubusercontent.com/CabooseMedia/caboose-plugin-template/main/manifest.json");
    });

}

init();