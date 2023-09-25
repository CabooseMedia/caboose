"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabooseDatabase = void 0;
class CabooseDatabase {
    constructor(serverManager) {
        this.serverManager = serverManager;
    }
    createFile(filePath) {
        throw new Error('Method not implemented.');
    }
    upsertFile(filePath) {
        throw new Error('Method not implemented.');
    }
}
exports.CabooseDatabase = CabooseDatabase;
