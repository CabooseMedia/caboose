import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import { Request, Response } from 'express';
import fs from 'fs';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import path from 'path';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export class APIManager extends Manager {

    public async onSetup(): Promise<void> {
        const authManager = this.caboose.getAuthManager();

        this.caboose.getRouteManager().registerPOSTRoute('/api/auth/login', authManager.handleLogin.bind(authManager));
        this.caboose.getRouteManager().registerPOSTRoute('/api/auth/logout', authManager.handleLogout.bind(authManager));
        this.caboose.getRouteManager().registerGETRoute('/api/auth/session', authManager.getSession.bind(authManager));

        this.caboose.getRouteManager().registerGETRoute('/api/*', this.handleGET.bind(this));
        this.caboose.getRouteManager().registerALLRoute('/api/*', this.handleALL.bind(this));
    }

    public handleGET(req: Request, res: Response): void {
        if (!this.verifyToken(req, res)) return;

        const route = req.path.substring(4);

        function startsWith(str: string): boolean {
            return route.startsWith(str);
        }

        if (startsWith('/test')) {
            res.status(200).json({
                code: 200,
                method: req.method,
                message: 'Test successful.'
            });
        } else if (startsWith('/moonknight')) {
            this.streamFile(req, res, 'D:\\Coding\\Caboose\\content\\tv\\moon knight\\Moon Knight - S01E05 - Asylum WEBDL-1080p-optimized.mp4');
        } else if (startsWith('/watch')) {
            let filePath = path.join(UNIVERSAL.CONTENT_DIR, req.query.file as string ?? '');
            if (!fs.existsSync(filePath)) {
                res.status(404).json({
                    code: 404,
                    method: req.method,
                    error: `File ${filePath} not found.`
                });
                return;
            }
            console.log('Transcoding started.');
            this.caboose.getTranscodeManager().transcodeStream(req, res, filePath);
        } else if (startsWith('/filesystem')) {
            let dirToRead = path.join(UNIVERSAL.CONTENT_DIR, req.query.path as string ?? '');
            if (!fs.existsSync(dirToRead)) {
                res.status(404).json({
                    code: 404,
                    method: req.method,
                    error: `Directory ${dirToRead} not found.`
                });
                return;
            }
            let content: any[] = [];
            fs.readdirSync(dirToRead).forEach(file => {
                let stats = fs.statSync(path.join(dirToRead, file));
                content.push({
                    key: stats.ino,
                    name: file,
                    modified: stats.mtimeMs,
                    type: stats.isDirectory() ? 'directory' : path.extname(file).substring(1),
                    size: stats.size
                });
            });
            res.status(200).json({
                code: 200,
                method: req.method,
                content: content
            });
        } else {
            res.status(404).json({
                code: 404,
                method: req.method,
                error: `API route ${req.path.substring(4)} not found.`
            });
        }
    }

    public handleALL(req: Request, res: Response): void {
        if (!this.verifyToken(req, res)) return;
        res.status(404).json({
            code: 404,
            method: req.method,
            error: `API route ${req.path.substring(4)} not found.`
        });
    }

    private verifyToken(req: Request, res: Response): boolean {
        try {
            // @ts-ignore
            jsonwebtoken.verify(req.headers.authorization.split('Bearer ')[1], process.env.JWT_SECRET!);
            return true;
        } catch (err) {
            res.status(401).json({
                code: 401,
                method: req.method,
                error: "Unauthorized."
            });
            return false;
        }
    }

    public streamFile(req: Request, res: Response, filePath: string): void {
        const range = req.headers.range;
        const fileSize = fs.statSync(filePath).size;
        const CHUNK_SIZE = 10 ** 6; //1MB
        const start = Number(range?.replace(/\D/g, "") ?? 0);
        const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        };
        res.writeHead(206, headers);

        const stream = fs.createReadStream(filePath, {
            start: start,
            end: end
        });

        stream.pipe(res);
    }

}