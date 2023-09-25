import { ServerManager } from "@caboose/managers";

export class CabooseDatabase {
    
    protected serverManager: ServerManager;
    
    constructor(serverManager: ServerManager) {
        this.serverManager = serverManager;
    }
    
    createFile(filePath: string) {
        throw new Error('Method not implemented.');
    }
    
    upsertFile(filePath: string) {
        throw new Error('Method not implemented.');
    }
    
}