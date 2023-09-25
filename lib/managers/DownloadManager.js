"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadManager = void 0;
const _logger_1 = __importDefault(require("@logger"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
class DownloadManager {
    constructor(serverManager) {
        _logger_1.default.debug(`DownloadManager initializing`);
        this.serverManager = serverManager;
    }
    installPluginFromGitHub(repository) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitRepository = repository.split("/").slice(-1)[0].split(".")[0];
            const gitUsername = repository.split("/").slice(-2)[0];
            const gitUsernameDir = path_1.default.join(this.serverManager.getDataDir(), "plugins", gitUsername);
            const gitRepositoryDir = path_1.default.join(gitUsernameDir, gitRepository);
            if (!fs_1.default.existsSync(gitRepositoryDir)) {
                fs_1.default.mkdirSync(gitRepositoryDir, {
                    recursive: true
                });
            }
            if (!fs_1.default.existsSync(path_1.default.join(gitRepositoryDir, ".git"))) {
                (0, child_process_1.execSync)(`git clone ${repository}`, {
                    cwd: gitUsernameDir
                });
                _logger_1.default.debug(`Cloned ${gitUsername}/${gitRepository}`);
            }
            else {
                (0, child_process_1.execSync)(`git fetch origin && git reset --hard`, {
                    cwd: gitRepositoryDir
                });
                _logger_1.default.debug(`Updated ${gitUsername}/${gitRepository}`);
            }
            (0, child_process_1.execSync)(`yarn --cwd ${gitRepositoryDir} --modules-folder ${path_1.default.join(gitRepositoryDir, "node_modules")} install`);
            _logger_1.default.debug(`Installed ${gitUsername}/${gitRepository}`);
            //execSync(`yarn --cwd ${gitRepositoryDir} build`);
            _logger_1.default.debug(`Built ${gitUsername}/${gitRepository}`);
            //execSync(`yarn --cwd ${gitRepositoryDir} start`);
            const plugin = require(path_1.default.join(gitRepositoryDir, "lib", "index.js"));
            return plugin;
        });
    }
    uninstallPluginFromGitHub(repository) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitRepository = repository.split("/").slice(-1)[0].split(".")[0];
            const gitUsername = repository.split("/").slice(-2)[0];
            const gitUsernameDir = path_1.default.join(this.serverManager.getDataDir(), "plugins", gitUsername);
            const gitRepositoryDir = path_1.default.join(gitUsernameDir, gitRepository);
            if (fs_1.default.existsSync(gitRepositoryDir)) {
                fs_1.default.rmSync(gitRepositoryDir, {
                    recursive: true,
                    force: true
                });
            }
            if (fs_1.default.existsSync(gitUsernameDir) && fs_1.default.readdirSync(gitUsernameDir).length === 0) {
                fs_1.default.rmdirSync(gitUsernameDir);
            }
            _logger_1.default.debug(`Uninstalled ${gitUsername}/${gitRepository}`);
        });
    }
}
exports.DownloadManager = DownloadManager;
