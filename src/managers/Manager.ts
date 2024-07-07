import CabooseServer from "@caboose";

export default class Manager {

    protected caboose: CabooseServer;

    constructor(caboose: CabooseServer) {
        this.caboose = caboose;

        this.initialize();
    }

    public async onSetup(): Promise<void> {
        await this.setup();
    }

    public async onStart(): Promise<void> {
        await this.start();
    }

    public async onStop(): Promise<void> {
        await this.stop();
    }

    public initialize(): void {
        // Override this method
    }

    public async setup(): Promise<void> {
        // Override this method
    }

    public async start(): Promise<void> {
        // Override this method
    }

    public async stop(): Promise<void> {
        // Override this method
    }

}