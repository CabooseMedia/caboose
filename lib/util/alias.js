"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = __importDefault(require("module-alias"));
const path_1 = __importDefault(require("path"));
const srcDir = path_1.default.resolve(__dirname, '../');
const mode = path_1.default.basename(srcDir) === 'lib' ? 'production' : 'development';
module_alias_1.default.addAliases({
    "@caboose": path_1.default.resolve(srcDir),
    "@logger": path_1.default.resolve(srcDir, "util", "log"),
    "@managers": path_1.default.resolve(srcDir, "managers"),
    "@databases": path_1.default.resolve(srcDir, "databases", "prisma", "generated")
});
const _logger_1 = __importDefault(require("@logger"));
_logger_1.default.debug(`Currently running in ${mode} mode. Aliases set to ${path_1.default.resolve(srcDir)}`);
process.env.SRC = path_1.default.basename(srcDir);
