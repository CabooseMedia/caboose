import { ScannerManager, ServerManager } from "@caboose/managers";
import { ScannerEvents } from "@caboose/enums";
import logger from "@logger";
import path from "path";
import fs from "fs";

import { execSync } from "child_process";

export class PluginManager {

    private serverManager: ServerManager;

    constructor(serverManager: ServerManager) {
        
        logger.debug(`PluginManager initializing`);

        this.serverManager = serverManager;

    }

    public installPlugin(url: string): void {
        const gitregex = RegExp(/https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.git/);
        if (gitregex.exec(url)) {
            this.serverManager.getDownloadManager().installPluginFromGitHub(url);
        } else {
            throw new Error(`Unsupported plugin URL [${url}]`);
        }
        
    }

    public uninstallPlugin(url: string): void {
        const gitregex = RegExp(/https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.git/);
        if (gitregex.exec(url)) {
            this.serverManager.getDownloadManager().uninstallPluginFromGitHub(url);
        } else {
            throw new Error(`Unsupported plugin URL [${url}]`);
        }
    }

}