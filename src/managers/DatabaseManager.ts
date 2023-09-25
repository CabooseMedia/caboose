import { ScannerManager, ServerManager, FileManager } from '@caboose/managers';
import { ScannerEvents } from "@caboose/enums";
import logger from "@logger";
import path from "path";
import { exec } from "child_process";
import { CabooseDatabase, SQLiteDatabase } from '@caboose/databases';

export class DatabaseManager {

    private serverManager: ServerManager;
    private database: CabooseDatabase;

    constructor(serverManager: ServerManager) {

        logger.debug(`DatabaseManager initializing`);

        this.serverManager = serverManager;

        this.database = new SQLiteDatabase(this.serverManager);

    }

    public async deploy(): Promise<void> {
        return new Promise((resolve, reject) => {
            process.env.DATABASE_URL = `file:${path.join(this.serverManager.getDataDir(), "database", "caboose.db")}`;
            logger.debug(`Deploying database to ${process.env.DATABASE_URL}`);
            const dbcommand = exec(`yarn migrate:deploy --schema=./${process.env.SRC}/databases/prisma/sqlite.prisma`);
            dbcommand.stdout?.pipe(process.stdout)
            dbcommand.on("exit", (code) => {
                logger.debug(`Database deployment exited with code ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    public createFile(filePath: string): void {
        this.database.createFile(filePath);
    }

    public upsertFile(filePath: string): void {
        this.database.upsertFile(filePath);
    }

}