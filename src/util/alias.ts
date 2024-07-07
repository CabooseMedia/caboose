import moduleAlias from 'module-alias';
import path from 'path';

const srcDir = path.resolve(__dirname, '../');

moduleAlias.addAliases({
    "@logger": path.resolve(srcDir, "util", "logger"),
    "@environment": path.resolve(srcDir, "util", "environment"),
    "@caboose": path.resolve(srcDir, "CabooseServer"),
    "@caboose/manager": path.resolve(srcDir, "managers", "Manager"),
    "@caboose/managers": path.resolve(srcDir, "managers"),
});