import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import { execSync, exec } from 'child_process';

export class DownloadManager extends Manager {

    public async downloadFromGithub(repo: string, dest: string): Promise<void> {
        execSync(`git clone ${repo} ${dest}`);
    }

    public async updateFromGithub(repo: string, dest: string): Promise<boolean> {
        execSync('git reset --hard HEAD', { cwd: dest });
        execSync('git clean -f -d', { cwd: dest });
        if (execSync('git pull -n', { cwd: dest }).toString() === "Already up to date.\n") {
            return false;
        }
        execSync('git pull', { cwd: dest });
        return true;
    }

    public async installNodeModules(dest: string): Promise<void> {
        execSync(`yarn --cwd ${dest} --modules-folder ${path.join(dest, "node_modules")} install`);
    }

    public async runBuildScript(dest: string): Promise<void> {
        execSync(`yarn --cwd ${dest} build`);
    }

}