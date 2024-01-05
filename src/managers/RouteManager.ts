import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import { Request, Response } from 'express';
import path from 'path';

export class RouteManager extends Manager {

    public handleAll(req: Request, res: Response): void {
        logger.debug(`Handling route ${req.path}`);
        if (UNIVERSAL.HOST_WEB) {
            this.caboose.getWebManager().getWebHandler()(req, res);
        } else {
            res.status(404).json({
                code: 404,
                method: req.method,
                message: `Route ${req.path} not found.`
            });
        }
    }

    public registerGETRoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().get(route, callback);
        logger.debug(`Registered GET route ${route}.`);
    }

    public registerHEADRoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().head(route, callback);
        logger.debug(`Registered HEAD route ${route}.`);
    }

    public registerPOSTRoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().post(route, callback);
        logger.debug(`Registered POST route ${route}.`);
    }

    public registerPUTRoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().put(route, callback);
        logger.debug(`Registered PUT route ${route}.`);
    }

    public registerDELETERoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().delete(route, callback);
        logger.debug(`Registered DELETE route ${route}.`);
    }

    public registerCONNECTRoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().connect(route, callback);
        logger.debug(`Registered CONNECT route ${route}.`);
    }

    public registerOPTIONSRoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().options(route, callback);
        logger.debug(`Registered OPTIONS route ${route}.`);
    }

    public registerTRACERoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().trace(route, callback);
        logger.debug(`Registered TRACE route ${route}.`);
    }

    public registerPATCHRoute(route: string, callback: (req: Request, res: Response) => void): void {
        this.caboose.getExpressManager().getExpressApp().patch(route, callback);
        logger.debug(`Registered PATCH route ${route}.`);
    }

}