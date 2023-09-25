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
exports.PluginManager = void 0;
const _logger_1 = __importDefault(require("@logger"));
const sdk_1 = require("@caboosemedia/sdk");
class PluginManager {
    constructor(serverManager) {
        _logger_1.default.debug(`PluginManager initializing`);
        this.serverManager = serverManager;
    }
    installPlugin(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const manifestRequest = yield fetch(url);
            const manifest = yield manifestRequest.json();
            const gitregex = RegExp(/https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.git/);
            if (gitregex.exec(manifest.repository)) {
                const plugin = yield this.serverManager.getDownloadManager().installPluginFromGitHub(manifest.repository);
                plugin.emit(sdk_1.PluginEvents.READY);
            }
            else {
                throw new Error(`Unsupported plugin URL [${url}]`);
            }
        });
    }
    uninstallPlugin(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const manifestRequest = yield fetch(url);
            const manifest = yield manifestRequest.json();
            const gitregex = RegExp(/https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.git/);
            if (gitregex.exec(manifest.repository)) {
                yield this.serverManager.getDownloadManager().uninstallPluginFromGitHub(manifest.repository);
            }
            else {
                throw new Error(`Unsupported plugin URL [${url}]`);
            }
        });
    }
}
exports.PluginManager = PluginManager;
