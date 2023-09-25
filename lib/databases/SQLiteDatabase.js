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
exports.SQLiteDatabase = void 0;
const CabooseDatabase_1 = require("./CabooseDatabase");
const path_1 = __importDefault(require("path"));
const sqlite_1 = require("@databases/sqlite");
class SQLiteDatabase extends CabooseDatabase_1.CabooseDatabase {
    constructor(serverManager) {
        super(serverManager);
        this.prisma = new sqlite_1.PrismaClient({
            datasources: {
                db: {
                    url: `file:${path_1.default.join(this.serverManager.getDataDir(), "database", "caboose.db")}`
                }
            }
        });
    }
    createFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.file.create({
                data: {
                    path: filePath
                }
            });
            //logger.debug(`Created file [${filePath}]`);
        });
    }
    upsertFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.file.upsert({
                where: {
                    path: filePath
                },
                create: {
                    path: filePath
                },
                update: {
                    path: filePath
                }
            });
            //logger.debug(`Upserted file [${filePath}]`);
        });
    }
    getFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.file.findUnique({
                where: {
                    path: filePath
                }
            });
        });
    }
}
exports.SQLiteDatabase = SQLiteDatabase;
