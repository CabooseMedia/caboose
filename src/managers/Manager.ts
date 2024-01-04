import { EventEmitter } from 'events';
import { CabooseServer } from '@caboose/server';
import { ManagerEvents } from '@caboose/events';
import { EventType } from '@caboose/types';

export class Manager extends EventEmitter {

    protected caboose: CabooseServer;

    constructor(server: CabooseServer) {
        super();
        this.caboose = server;

        this.initialize();

        this.emit(ManagerEvents.INITIALIZED, {
            name: this.constructor.name,
        });
    }

    public async start(): Promise<void> {
        await this.onStart();

        this.emit(ManagerEvents.READY, {
            name: this.constructor.name,
        });
    }

    public initialize(): void {
        // Override this method
    }

    public async onStart(): Promise<void> {
        // Override this method
    }

    public emit(event: EventType, ...args: any[]): boolean {
        return this.caboose.emit(event, ...args);
    }

}