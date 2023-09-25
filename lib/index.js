"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./util/alias");
const _logger_1 = __importDefault(require("@logger"));
const express_1 = __importDefault(require("express"));
const managers_1 = require("@caboose/managers");
const server = (0, express_1.default)();
function init() {
    _logger_1.default.debug(`Initializing server`);
    const serverManager = new managers_1.ServerManager();
    startServer(serverManager);
}
function startServer(serverManager) {
    server.get('/api/v1/directory', (req, res) => {
        var _a;
        const directoryPath = (_a = req.query.path) !== null && _a !== void 0 ? _a : "/";
        const directoryContents = serverManager.getFileManager().getDirectoryContents(directoryPath);
        res.json(directoryContents);
    });
    server.listen(process.env.CABOOSE_SERVER_PORT, () => {
        _logger_1.default.info(`Server listening on port ${process.env.CABOOSE_SERVER_PORT}`);
        //serverManager.getPluginManager().uninstallPlugin("https://github.com/HackboxGames/HackboxServer.git");
        serverManager.getPluginManager().uninstallPlugin("https://raw.githubusercontent.com/CabooseMedia/caboose-plugin-filebrowser/main/manifest.json");
        serverManager.getPluginManager().installPlugin("https://raw.githubusercontent.com/CabooseMedia/caboose-plugin-template/main/manifest.json");
    });
}
init();
