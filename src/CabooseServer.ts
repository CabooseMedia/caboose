import "dotenv/config";
import "./util/alias";

import logger, { setLoggerFileTransport } from "@logger";
import environment, { setupEnvironment } from "@environment";

import Manager from "@caboose/manager";
import { ConfigManager, DatabaseManager, WebServerManager, PluginManager } from "@caboose/managers";

export default class CabooseServer {

    private managers: Manager[];
    private configManager: ConfigManager;
    private databaseManager: DatabaseManager;
    private webServerManager: WebServerManager;
    private pluginManager: PluginManager;

    constructor() {
        this.configManager = new ConfigManager(this);
        this.databaseManager = new DatabaseManager(this);
        this.webServerManager = new WebServerManager(this);
        this.pluginManager = new PluginManager(this);

        this.managers = [
            this.configManager,
            this.databaseManager,
            this.webServerManager,
            this.pluginManager
        ];

        this.start();
    }

    public async start(): Promise<void> {
        logger.info("Welcome to Caboose! Getting things ready...");

        setupEnvironment();
        setLoggerFileTransport();

        logger.verbose("Caboose environment setup complete.")
        logger.verbose("Setting up managers...");

        await this.setupAllManagers();
        await this.startAllManagers();
        
        process.on("SIGINT", this.stop.bind(this));

        logger.info("Caboose is ready! Enjoy!");
    }

    public async stop(): Promise<void> {
        logger.verbose("Stopping...");
        await this.stopAllManagers();
        logger.verbose("Stopped!");
        process.exit(0);
    }

    public async setupAllManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.onSetup());
        }
        await Promise.all(promises);
    }

    public async startAllManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.onStart());
        }
        await Promise.all(promises);
    }

    public async stopAllManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.onStop());
        }
        await Promise.all(promises);
    }

    public getConfigManager(): ConfigManager {
        return this.configManager;
    }

    public getDatabaseManager(): DatabaseManager {
        return this.databaseManager;
    }

    public getWebServerManager(): WebServerManager {
        return this.webServerManager;
    }

    public getPluginManager(): PluginManager {
        return this.pluginManager;
    }

}

new CabooseServer();