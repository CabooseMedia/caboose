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
exports.DatabaseManager = void 0;
const _logger_1 = __importDefault(require("@logger"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const databases_1 = require("@caboose/databases");
class DatabaseManager {
    constructor(serverManager) {
        _logger_1.default.debug(`DatabaseManager initializing`);
        this.serverManager = serverManager;
        this.database = new databases_1.SQLiteDatabase(this.serverManager);
    }
    deploy() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                process.env.DATABASE_URL = `file:${path_1.default.join(this.serverManager.getDataDir(), "database", "caboose.db")}`;
                _logger_1.default.debug(`Deploying database to ${process.env.DATABASE_URL}`);
                const dbcommand = (0, child_process_1.exec)(`yarn migrate:deploy --schema=./${process.env.SRC}/databases/prisma/sqlite.prisma`);
                (_a = dbcommand.stdout) === null || _a === void 0 ? void 0 : _a.pipe(process.stdout);
                dbcommand.on("exit", (code) => {
                    _logger_1.default.debug(`Database deployment exited with code ${code}`);
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
        });
    }
    createFile(filePath) {
        this.database.createFile(filePath);
    }
    upsertFile(filePath) {
        this.database.upsertFile(filePath);
    }
}
exports.DatabaseManager = DatabaseManager;
