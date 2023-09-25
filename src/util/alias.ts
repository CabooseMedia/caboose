import moduleAlias from 'module-alias';
import path from 'path';

const srcDir = path.resolve(__dirname, '../');

const mode = path.basename(srcDir) === 'dist' ? 'production' : 'development';

moduleAlias.addAliases({
    "@caboose": path.resolve(srcDir),
    "@logger": path.resolve(srcDir, "util", "log"),
    "@managers": path.resolve(srcDir, "managers"),
    "@databases": path.resolve(srcDir, "databases", "prisma", "generated")
});

import logger from '@logger';

logger.debug(`Currently running in ${mode} mode. Aliases set to ${path.resolve(srcDir)}`);

process.env.SRC = path.basename(srcDir);