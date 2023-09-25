import { ScannerManager, ServerManager } from "@caboose/managers";
import { ScannerEvents } from "@caboose/events";
import logger from "@logger";
import path from "path";
import fs from "fs";

import { PluginEvents } from "@caboosemedia/sdk";

import { execSync } from "child_process";

export class PluginManager {

    private serverManager: ServerManager;

    constructor(serverManager: ServerManager) {
        
        logger.debug(`PluginManager initializing`);

        this.serverManager = serverManager;

    }

    public async installPlugin(url: string): Promise<void> {
        const manifestRequest = await fetch(url);
        const manifest = await manifestRequest.json();
        const gitregex = RegExp(/https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.git/);
        if (gitregex.exec(manifest.repository)) {
            const plugin = await this.serverManager.getDownloadManager().installPluginFromGitHub(manifest.repository);
            plugin.emit(PluginEvents.READY);
        } else {
            throw new Error(`Unsupported plugin URL [${url}]`);
        }
    }

    public async uninstallPlugin(url: string): Promise<void> {
        const manifestRequest = await fetch(url);
        const manifest = await manifestRequest.json();
        const gitregex = RegExp(/https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.git/);
        if (gitregex.exec(manifest.repository)) {
            await this.serverManager.getDownloadManager().uninstallPluginFromGitHub(manifest.repository);
        } else {
            throw new Error(`Unsupported plugin URL [${url}]`);
        }
    }

}