import moduleAlias from 'module-alias';
import path from 'path';

const srcDir = path.resolve(__dirname, '../');

moduleAlias.addAliases({
    "@caboose": path.resolve(srcDir),
    "@caboose/server": path.resolve(srcDir, "CabooseServer"),
    "@util": path.resolve(srcDir, "util"),
    "@logger": path.resolve(srcDir, "util", "log"),
});

import logger from '@logger';

logger.debug(`Server currently running in ${process.env.CABOOSE_SERVER_ENV} mode. Aliases set to ${path.resolve(srcDir)}`);

logger.silly('Aliases successfully imported and initialized.');

process.env.SRC = path.basename(srcDir);