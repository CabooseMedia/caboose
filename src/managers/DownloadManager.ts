import { ScannerManager, ServerManager } from "@caboose/managers";
import { ScannerEvents } from "@caboose/enums";
import logger from "@logger";
import path from "path";
import fs from "fs";

import { execSync, exec } from 'child_process';

export class DownloadManager {

    private serverManager: ServerManager;

    constructor(serverManager: ServerManager) {

        logger.debug(`DownloadManager initializing`);

        this.serverManager = serverManager;

    }

    public installPluginFromGitHub(url: string): void {
        const gitRepository = url.split("/").slice(-1)[0].split(".")[0];
        const gitUsername = url.split("/").slice(-2)[0];
        const gitUsernameDir = path.join(this.serverManager.getDataDir(), "plugins", gitUsername);
        const gitRepositoryDir = path.join(gitUsernameDir, gitRepository);
        if (!fs.existsSync(gitRepositoryDir)) {
            fs.mkdirSync(gitRepositoryDir, {
                recursive: true
            });
        }
        if (!fs.existsSync(path.join(gitRepositoryDir, ".git"))) {
            execSync(`git clone ${url}`, {
                cwd: gitUsernameDir
            });
            logger.debug(`Cloned ${gitUsername}/${gitRepository}`);
        } else {

            // you need this commented out code
            // currently disabled because awfully-salty-squid is terribly outdated

            // execSync(`git fetch origin && git reset --hard`, {
            //     cwd: gitRepositoryDir
            // });
            logger.debug(`Updated ${gitUsername}/${gitRepository}`);
        }
        execSync(`yarn --cwd ${gitRepositoryDir} --modules-folder ${path.join(gitRepositoryDir, "node_modules")} install`);
        logger.debug(`Installed ${ gitUsername }/${gitRepository}`);
        //execSync(`yarn --cwd ${gitRepositoryDir} build`);
        logger.debug(`Built ${ gitUsername }/${gitRepository}`);
        execSync(`yarn --cwd ${gitRepositoryDir} start`);
    }

    public uninstallPluginFromGitHub(url: string): void {
        const gitRepository = url.split("/").slice(-1)[0].split(".")[0];
        const gitUsername = url.split("/").slice(-2)[0];
        const gitUsernameDir = path.join(this.serverManager.getDataDir(), "plugins", gitUsername);
        const gitRepositoryDir = path.join(gitUsernameDir, gitRepository);
        if (fs.existsSync(gitRepositoryDir)) {
            fs.rmSync(gitRepositoryDir, {
                recursive: true,
                force: true
            });
        }
        if (fs.existsSync(gitUsernameDir) && fs.readdirSync(gitUsernameDir).length === 0) {
            fs.rmdirSync(gitUsernameDir);
        }
        logger.debug(`Uninstalled ${gitUsername}/${gitRepository}`);
    }

}