import logger from "@logger";

import { Manager } from "@caboose/managers";
import { Server, Socket } from "socket.io";

export class SocketManager extends Manager {

    protected io!: Server;

    public async onStart(): Promise<void> {
        this.io = new Server(this.caboose.getExpressManager().getExpressServer(), {
            cors: {
                origin: "*",
            }
        });

        this.io.on('connection', (socket: Socket) => {
            logger.debug(`Socket connected: ${socket.id}`);

            socket.on('disconnecting', () => {
                logger.debug(`Socket disconnecting: ${socket.id}`);
            });

            socket.on('disconnect', () => {
                logger.debug(`Socket disconnected: ${socket.id}`);
            });

        });
    }

}