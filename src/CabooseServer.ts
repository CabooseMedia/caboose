import logger from "@logger";

import { EventEmitter } from 'events';
import { DownloadManager, ExpressManager, Manager, RouteManager, SocketManager, WebManager, DatabaseManager } from "@caboose/managers";
import { EventType } from "@caboose/types";
import { ServerEvents } from "@caboose/events";

export class CabooseServer extends EventEmitter {

    private managers: Manager[];
    private expressManager: ExpressManager;
    private routeManager: RouteManager;
    private socketManager: SocketManager;
    private downloadManager: DownloadManager;
    private webManager: WebManager;
    private databaseManager: DatabaseManager;

    constructor() {
        super();

        this.expressManager = new ExpressManager(this);
        this.routeManager = new RouteManager(this);
        this.socketManager = new SocketManager(this);
        this.downloadManager = new DownloadManager(this);
        this.webManager = new WebManager(this);
        this.databaseManager = new DatabaseManager(this);

        this.managers = [
            this.expressManager,
            this.routeManager,
            this.socketManager,
            this.downloadManager,
            this.webManager,
            this.databaseManager
        ];

        this.emit(ServerEvents.INITIALIZED);
    }

    public async start(): Promise<void> {
        logger.debug("Starting managers...");
        await this.setupManagers();
        await this.startManagers();
        this.emit(ServerEvents.READY);
    }

    public async setupManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.setup());
        }
        await Promise.all(promises);
    }
    
    public async startManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.start());
        }
        await Promise.all(promises);
    }

    public getExpressManager(): ExpressManager {
        return this.expressManager;
    }

    public getRouteManager(): RouteManager {
        return this.routeManager;
    }

    public getSocketManager(): SocketManager {
        return this.socketManager;
    }

    public getDownloadManager(): DownloadManager {
        return this.downloadManager;
    }

    public getWebManager(): WebManager {
        return this.webManager;
    }

    public getDatabaseManager(): DatabaseManager {
        return this.databaseManager;
    }

    public emit(event: EventType, ...args: any[]): boolean {
        logger.silly(`Emitting ${event.toString()}${args.length > 0 ? ` with args ${JSON.stringify(args)}` : ''}`);
        return super.emit(event, ...args);
    }

}

logger.silly("CabooseServer class successfully imported.");