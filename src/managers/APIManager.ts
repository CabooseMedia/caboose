import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import { Request, Response } from 'express';
import fs from 'fs';

export class APIManager extends Manager {

    public async onSetup(): Promise<void> {
        this.caboose.getRouteManager().registerALLRoute('/api/*', this.handleAll.bind(this));
    }

    public handleAll(req: Request, res: Response): void {
        logger.verbose(`Handling route ${req.path}`);
        let apiPath = req.path.replace('/api', '');
        switch (apiPath) {
            case '/test':
                res.status(200).json({
                    code: 200,
                    method: req.method,
                    message: 'Test successful.'
                });
                break;
            default:
                res.status(404).json({
                    code: 404,
                    method: req.method,
                    message: `API route ${apiPath} not found.`
                });
                break;
        }
    }

}