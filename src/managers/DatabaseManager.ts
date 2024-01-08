import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import { execSync, exec } from 'child_process';

export class DatabaseManager extends Manager {

    private databaseProvider!: string;
    private databaseURL!: string;

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
    }

}