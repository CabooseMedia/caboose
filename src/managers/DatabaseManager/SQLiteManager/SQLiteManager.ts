import Manager from "@caboose/manager";
import environment from "@environment";
import logger from "@logger";
import { DB } from './types';
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { execSync } from "child_process";
import path from "path";
import Database from "better-sqlite3";

export default class SQLiteManager extends Manager {

    private database!: Kysely<DB>;

    public async setup(): Promise<void> {
        logger.verbose("Running SQLite migrations...");
        execSync(`yarn prisma migrate deploy --schema ${environment.CABOOSE_DATABASE_SCHEMA}`);

        this.database = new Kysely<DB>({
            dialect: new SqliteDialect({
                database: new Database(environment.CABOOSE_DATABASE_PATH)
            })
        });
    }

    public async start(): Promise<void> {
        
    }

    public async stop(): Promise<void> {
        await this.database.destroy();
    }

}