import logger from "@logger";
import express from "express";
import https from "https";
import selfsigned from "selfsigned";
import fs from "fs";
import path from "path";
import crypto from "crypto";

import { Manager } from "@caboose/managers";
import { UNIVERSAL } from "@util/universal";

export class ExpressManager extends Manager {

    private expressApp!: express.Application;
    private expressServer!: https.Server;
    private serverPort!: number;
    private certsDir!: string;
    private certs!: {
        cert: Buffer,
        key: Buffer
    };

    public initialize(): void {

        this.serverPort = parseInt(process.env.SERVER_PORT ?? '52470');
        this.certsDir = path.resolve(UNIVERSAL.DATA_DIR, 'certs');

        if (!fs.existsSync(this.certsDir)) {
            fs.mkdirSync(this.certsDir);
        }

        if (!fs.existsSync(path.resolve(this.certsDir, 'cert.pem')) || !fs.existsSync(path.resolve(this.certsDir, 'key.pem'))) {
            logger.warn("No SSL certificates found. Generating new ones...");
            logger.warn("You may see a warning in your browser about the certificate being self-signed. This is normal.");
            const pems = selfsigned.generate([{ name: 'commonName', value: 'localhost' }], { days: 365 });
            fs.writeFileSync(path.resolve(this.certsDir, 'cert.pem'), pems.cert);
            fs.writeFileSync(path.resolve(this.certsDir, 'key.pem'), pems.private);
        }

        const cert = new crypto.X509Certificate(fs.readFileSync(path.resolve(this.certsDir, 'cert.pem')));
        if (cert.issuer == "CN=localhost") {
            logger.warn("You are using a self-signed certificate. This is not recommended for production use.");
            logger.warn("If you want to use your own certificates, place them in the data/certs directory.");
        } else {
            logger.info("Certificates are signed by a trusted CA. You may use these in production.");
            logger.warn("If you want to use self-signed certificates, delete the existing ones in the data/certs directory and restart Caboose.");
        }

        this.certs = {
            cert: fs.readFileSync(path.resolve(this.certsDir, 'cert.pem')),
            key: fs.readFileSync(path.resolve(this.certsDir, 'key.pem'))
        };

        logger.silly("Certificates loaded successfully.");

        this.expressApp = express();
        this.expressServer = https.createServer({
            key: this.certs.key,
            cert: this.certs.cert
        }, this.expressApp);
    }

    public async onStart(): Promise<void> {
        this.expressApp.all('*', (req, res) => {
            this.caboose.getRouteManager().handleAll(req, res);
        });
        this.expressServer.listen(this.serverPort, () => {
            logger.debug(`Express server listening on port ${this.serverPort}`);
        });
    }

    public getExpressApp(): express.Application {
        return this.expressApp;
    }

    public getExpressServer(): https.Server {
        return this.expressServer;
    }

}