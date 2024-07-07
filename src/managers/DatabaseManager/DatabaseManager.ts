import logger from "@logger";
import environment from "@environment";
import Manager from "@caboose/manager"

import SQLiteManager from "./SQLiteManager/SQLiteManager";

export default class DatabaseManager extends Manager {

    private databaseManager!: SQLiteManager;
    private databaseType!: "sqlite";

    public initialize(): void {
        this.databaseType = environment.CABOOSE_DATABASE_TYPE;
    }

    public async setup(): Promise<void> {
        if (this.databaseType == "sqlite") {
            this.databaseManager = new SQLiteManager(this.caboose);
        } else {
            logger.error("Database type not supported! Shutting down...");
            await this.caboose.stop();
            return;
        }
        await this.databaseManager.onSetup();
    }

    public async start(): Promise<void> {
        await this.databaseManager.onStart();
    }

    public async stop(): Promise<void> {
        await this.databaseManager.onStop();
    }

}