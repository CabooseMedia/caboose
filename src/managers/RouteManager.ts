import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import { Request, Response } from 'express';

export class RouteManager extends Manager {

    protected routes!: {
        GET: { [route: string]: (req: Request, res: Response) => void },
        HEAD: { [route: string]: (req: Request, res: Response) => void },
        POST: { [route: string]: (req: Request, res: Response) => void },
        PUT: { [route: string]: (req: Request, res: Response) => void },
        DELETE: { [route: string]: (req: Request, res: Response) => void },
        CONNECT: { [route: string]: (req: Request, res: Response) => void },
        OPTIONS: { [route: string]: (req: Request, res: Response) => void },
        TRACE: { [route: string]: (req: Request, res: Response) => void },
        PATCH: { [route: string]: (req: Request, res: Response) => void }
    };

    public initialize(): void {
        this.routes = {
            GET: {},
            HEAD: {},
            POST: {},
            PUT: {},
            DELETE: {},
            CONNECT: {},
            OPTIONS: {},
            TRACE: {},
            PATCH: {}
        };
    }

    public async onStart(): Promise<void> {
        this.registerGETRoute(`/`, (req, res) => {
            res.send("Caboose!");
        });
    }

    public handleRoute(req: Request, res: Response): void {
        logger.debug(`Handling route ${req.path}`);
        switch (req.method) {
            case 'GET':
                if (this.routes.GET[req.path]) {
                    this.routes.GET[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'GET',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'HEAD':
                if (this.routes.HEAD[req.path]) {
                    this.routes.HEAD[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'HEAD',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'POST':
                if (this.routes.POST[req.path]) {
                    this.routes.POST[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'POST',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'PUT':
                if (this.routes.PUT[req.path]) {
                    this.routes.PUT[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'PUT',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'DELETE':
                if (this.routes.DELETE[req.path]) {
                    this.routes.DELETE[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'DELETE',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'CONNECT':
                if (this.routes.CONNECT[req.path]) {
                    this.routes.CONNECT[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'CONNECT',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'OPTIONS':
                if (this.routes.OPTIONS[req.path]) {
                    this.routes.OPTIONS[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'OPTIONS',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'TRACE':
                if (this.routes.TRACE[req.path]) {
                    this.routes.TRACE[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'TRACE',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            case 'PATCH':
                if (this.routes.PATCH[req.path]) {
                    this.routes.PATCH[req.path](req, res);
                } else {
                    res.status(404).json({
                        code: 404,
                        method: 'PATCH',
                        message: `Route ${req.path} not found.`
                    });
                }
                break;
            default:
                res.status(500).json({
                    code: 500,
                    method: req.method,
                    message: `Unknown method ${req.method}.`
                });
                break;
        }
    }

    public registerGETRoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.GET[route]) {
            logger.warn(`GET route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.GET[route] = callback;
            logger.debug(`Registered GET route ${route}.`);
            return true;
        }
    }

    public registerHEADRoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.HEAD[route]) {
            logger.warn(`HEAD route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.HEAD[route] = callback;
            logger.debug(`Registered HEAD route ${route}.`);
            return true;
        }
    }

    public registerPOSTRoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.POST[route]) {
            logger.warn(`POST route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.POST[route] = callback;
            logger.debug(`Registered POST route ${route}.`);
            return true;
        }
    }

    public registerPUTRoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.PUT[route]) {
            logger.warn(`PUT route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.PUT[route] = callback;
            logger.debug(`Registered PUT route ${route}.`);
            return true;
        }
    }

    public registerDELETERoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.DELETE[route]) {
            logger.warn(`DELETE route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.DELETE[route] = callback;
            logger.debug(`Registered DELETE route ${route}.`);
            return true;
        }
    }

    public registerCONNECTRoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.CONNECT[route]) {
            logger.warn(`CONNECT route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.CONNECT[route] = callback;
            logger.debug(`Registered CONNECT route ${route}.`);
            return true;
        }
    }

    public registerOPTIONSRoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.OPTIONS[route]) {
            logger.warn(`OPTIONS route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.OPTIONS[route] = callback;
            logger.debug(`Registered OPTIONS route ${route}.`);
            return true;
        }
    }

    public registerTRACERoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.TRACE[route]) {
            logger.warn(`TRACE route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.TRACE[route] = callback;
            logger.debug(`Registered TRACE route ${route}.`);
            return true;
        }
    }

    public registerPATCHRoute(route: string, callback: (req: Request, res: Response) => void): boolean {
        if (this.routes.PATCH[route]) {
            logger.warn(`PATCH route ${route} already exists and could not be registered.`);
            return false;
        } else {
            this.routes.PATCH[route] = callback;
            logger.debug(`Registered PATCH route ${route}.`);
            return true;
        }
    }

}