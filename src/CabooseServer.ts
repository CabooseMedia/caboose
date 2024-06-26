import logger from "@logger";

import { EventEmitter } from 'events';
import { DownloadManager, ExpressManager, Manager, RouteManager, SocketManager, WebManager, DatabaseManager, APIManager, EmailManager, InviteManager, TranscodeManager, AuthManager } from "@caboose/managers";
import { EventType } from "@caboose/types";
import { ServerEvents } from "@caboose/events";

export class CabooseServer extends EventEmitter {

    private managers: Manager[];
    private expressManager: ExpressManager;
    private routeManager: RouteManager;
    private authManager: AuthManager;
    private socketManager: SocketManager;
    private downloadManager: DownloadManager;
    private webManager: WebManager;
    private databaseManager: DatabaseManager;
    private apiManager: APIManager;
    private emailManager: EmailManager;
    private inviteManager: InviteManager;
    private transcodeManager: TranscodeManager;

    constructor() {
        super();

        this.expressManager = new ExpressManager(this);
        this.routeManager = new RouteManager(this);
        this.authManager = new AuthManager(this);
        this.socketManager = new SocketManager(this);
        this.downloadManager = new DownloadManager(this);
        this.webManager = new WebManager(this);
        this.databaseManager = new DatabaseManager(this);
        this.apiManager = new APIManager(this);
        this.emailManager = new EmailManager(this);
        this.inviteManager = new InviteManager(this);
        this.transcodeManager = new TranscodeManager(this);

        this.managers = [
            this.expressManager,
            this.routeManager,
            this.authManager,
            this.socketManager,
            this.downloadManager,
            this.webManager,
            this.databaseManager,
            this.apiManager,
            this.emailManager,
            this.inviteManager,
            this.transcodeManager,
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

    public getAPIManager(): APIManager {
        return this.apiManager;
    }

    public getEmailManager(): EmailManager {
        return this.emailManager;
    }

    public getInviteManager(): InviteManager {
        return this.inviteManager;
    }

    public getTranscodeManager(): TranscodeManager {
        return this.transcodeManager;
    }

    public getAuthManager(): AuthManager {
        return this.authManager;
    }

    public emit(event: EventType, ...args: any[]): boolean {
        logger.silly(`Emitting ${event.toString()}${args.length > 0 ? ` with args ${JSON.stringify(args)}` : ''}`);
        return super.emit(event, ...args);
    }

}

logger.silly("CabooseServer class successfully imported.");