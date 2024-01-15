import { Manager } from '@caboose/managers';
import logger from "@logger";
import { PrismaClient } from '@prisma/client'
import jsonwebtoken from 'jsonwebtoken';

import { execSync, exec } from 'child_process';

export class DatabaseManager extends Manager {

    private databaseProvider!: string;
    private databaseURL!: string;
    private prisma!: PrismaClient;

    public initialize(): void {
        this.databaseURL = process.env.DATABASE_URL ?? '';
        switch (this.databaseURL?.split(':')[0]) {
            case 'postgres':
                this.databaseProvider = 'postgres';
                break;
            default:
                throw new Error(`Unknown database provider`);
        }
    }

    public async onSetup(): Promise<void> {
        execSync(`yarn prisma:migrate:deploy`);
        this.prisma = new PrismaClient();
    }

    public getPrismaClient(): PrismaClient {
        return this.prisma;
    }

}