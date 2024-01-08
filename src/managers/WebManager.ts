import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import path from 'path';
import fs from 'fs';

export class WebManager extends Manager {

    protected webRepository!: string;
    protected webHandler!: any;

    public initialize(): void {
        this.webRepository = "https://github.com/CabooseMedia/caboose-web"

        if (!fs.existsSync(UNIVERSAL.WEB_DIR)) {
            fs.mkdirSync(UNIVERSAL.WEB_DIR);
        }
    }

    public async onSetup(): Promise<void> {
        if (!UNIVERSAL.HOST_WEB) {
            logger.warn("You have not opted into hosting the web repository. (HOST_WEB is true by default)");
            logger.warn("To access the website, you'll need to host the web repository separately.");
            logger.warn("All api routes will still work, but the website will not be accessible.");
            return;
        }
        let shouldBuild = false;
        if (fs.existsSync(path.resolve(UNIVERSAL.WEB_DIR, ".git"))) {
            if (UNIVERSAL.AUTOUPDATE_WEB) {
                logger.info("Checking for updates to the web repository and downloading...");
                shouldBuild = await this.caboose.getDownloadManager().updateFromGithub(this.webRepository, path.resolve(UNIVERSAL.WEB_DIR));
            } else {
                logger.warn("You have opted out of automatically updating the web repository. (AUTOUPDATE_WEB is true by default)");
                logger.warn("To update the web repository, you'll need to do so manually.");
                return;
            }
        } else {
            logger.info("Downloading the web repository...");
            await this.caboose.getDownloadManager().downloadFromGithub(this.webRepository, path.resolve(UNIVERSAL.WEB_DIR));
            shouldBuild = true;
        }
        if (shouldBuild) {
            logger.info("Installing the web repository dependencies...");
            await this.caboose.getDownloadManager().installNodeModules(path.resolve(UNIVERSAL.WEB_DIR));
            logger.info("Generating the prisma client...");
            await this.caboose.getDownloadManager().runPrismaGenerateScript(path.resolve(UNIVERSAL.WEB_DIR));
            logger.info("Building website for production...");
            await this.caboose.getDownloadManager().runBuildScript(path.resolve(UNIVERSAL.WEB_DIR));
        }
        logger.info("Loading the web repository...");
        const web = require(path.resolve(UNIVERSAL.WEB_DIR, "dist/export.js"));
        this.webHandler = await web.getRequestHandler();
        logger.info("Web repository loaded.");
    }

    public getWebHandler(): any {
        return this.webHandler;
    }

}