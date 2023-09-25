import { ServerManager } from "@caboose/managers";
import { CabooseDatabase } from "./CabooseDatabase";

import path from "path";

import { Prisma, PrismaClient } from "@databases/sqlite";
import { DefaultArgs } from "@databases/sqlite/runtime/library";
import logger from "@logger";

export class SQLiteDatabase extends CabooseDatabase {

    private prisma: PrismaClient;

    constructor(serverManager: ServerManager) {
        super(serverManager);
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: `file:${path.join(this.serverManager.getDataDir(), "database", "caboose.db")}`
                }
            }
        });
    }

    public async createFile(filePath: string): Promise<void> {
        await this.prisma.file.create({
            data: {
                path: filePath
            }
        });
        //logger.debug(`Created file [${filePath}]`);
    }

    public async upsertFile(filePath: string): Promise<void> {
        await this.prisma.file.upsert({
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
    }

    public async getFile(filePath: string): Promise<Prisma.Prisma__FileClient<{
        id: number;
        path: string;
    } | null, null, DefaultArgs>> {
        return await this.prisma.file.findUnique({
            where: {
                path: filePath
            }
        });
    }

}