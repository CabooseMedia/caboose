import Manager from "@caboose/manager"

import fastify, { FastifyInstance } from "fastify";

export default class WebServerManager extends Manager {

    private server!: FastifyInstance;

    public initialize(): void {
        this.server = fastify();
    }

    public async setup(): Promise<void> {
        this.server.get("/", async (request, reply) => {
            return { hello: "world" }
        });
    }

    public async start(): Promise<void> {
        await this.server.listen({
            port: 3000,
            host: "0.0.0.0"
        });
    }

    public async stop(): Promise<void> {
        
    }

}