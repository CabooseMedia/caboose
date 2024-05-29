import { Manager } from '@caboose/managers';
import logger from "@logger";
import { PrismaClient } from '@prisma/client';
import { UNIVERSAL } from '@util/universal';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import path from 'path';
import bcrypt from 'bcryptjs';
import platform from 'platform';
import ShortUniqueId from 'short-unique-id';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export class AuthManager extends Manager {

    protected prisma!: PrismaClient;
    protected unsecureRoutes!: string[];

    public initialize(): void {
        this.unsecureRoutes = [
            '/login',
            '/sw.js'
        ];
    }

    public async onStart(): Promise<void> {
        this.prisma = this.caboose.getDatabaseManager().getPrismaClient();
    }

    public async handleLogin(req: Request, res: Response): Promise<void> {

        const existingSession = await this.verifySession(req, res);

        if (existingSession) {
            res.status(200).json({ message: 'Already logged in' });
            return;
        }

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Invalid request' });
            return;
        }

        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        const passwordHashMatches = await bcrypt.compare(password, user?.password ?? '');

        if (!user || !passwordHashMatches) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const userAgent = platform.parse(req.headers['user-agent']);

        let deviceId;
        let existingDevice;

        try {
            let decodedDeviceId = jsonwebtoken.verify(req.cookies['caboose-device-id'], UNIVERSAL.JWT_SECRET) as JwtPayload;
            deviceId = decodedDeviceId?.deviceId as string;
            existingDevice = await this.prisma.device.findUnique({
                where: {
                    deviceId: deviceId
                }
            });
        } catch (error) {
            deviceId = "no id";
        }

        if (!existingDevice) {

            let currentDeviceIds = (await this.prisma.device.findMany({
                select: {
                    deviceId: true
                }
            })).map((device) => {
                return device.deviceId;
            });

            const uid = new ShortUniqueId({
                length: 32
            });
            let generatedDeviceId;
            do {
                generatedDeviceId = uid.rnd();
            } while (currentDeviceIds.includes(generatedDeviceId));

            deviceId = generatedDeviceId;

            const deviceToken = jsonwebtoken.sign({
                deviceId: generatedDeviceId
            }, UNIVERSAL.JWT_SECRET);

            res.cookie('caboose-device-id', deviceToken, {
                httpOnly: true,
                secure: true
            });
        }

        let currentSessionIds = (await this.prisma.session.findMany({
            select: {
                sessionId: true
            }
        })).map((session) => {
            return session.sessionId;
        });

        const uid = new ShortUniqueId({
            length: 32
        });
        let generatedSessionId;
        do {
            generatedSessionId = uid.rnd();
        } while (currentSessionIds.includes(generatedSessionId));

        const device = await this.prisma.device.upsert({
            where: {
                deviceId: deviceId
            },
            create: {
                deviceId: deviceId,
                userId: user.id,
                deviceName: userAgent.name,
                deviceOS: userAgent.os?.toString(),
                deviceIP: req.ip
            },
            update: {
                deviceName: userAgent.name,
                deviceOS: userAgent.os?.toString(),
                deviceIP: req.ip
            }
        });

        const session = await this.prisma.session.create({
            data: {
                sessionId: generatedSessionId,
                user: {
                    connect: {
                        id: user.id
                    }
                },
                device: {
                    connect: {
                        id: device.id
                    }
                },
            }
        });

        const sessionToken = jsonwebtoken.sign({
            sessionId: session.sessionId
        }, UNIVERSAL.JWT_SECRET);

        res.cookie('caboose-session', sessionToken, {
            httpOnly: true,
            secure: true
        });

        res.status(200).json({ message: 'Logged in' });
    }

    public async handleLogout(req: Request, res: Response): Promise<void> {

        try {
            let sessionId = (jsonwebtoken.verify(req.cookies['caboose-session'], UNIVERSAL.JWT_SECRET) as JwtPayload).sessionId;
            await this.prisma.session.delete({
                where: {
                    sessionId: sessionId
                }
            })
        } catch (error) {

        }

        res.clearCookie('caboose-session');

        res.status(200).json({ message: 'Logged out' });

    }

    public async getSession(req: Request, res: Response): Promise<void> {

        let session = await this.verifySession(req, res);

        if (session) {
            res.status(200).json(session);
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }

    }

    public async verifySession(req: Request, res: Response): Promise<any> {

        if (this.unsecureRoutes.includes(req.path)) {
            return true;
        }

        let isAuthed;
        let session;

        try {

            if (!req.cookies['caboose-device-id']) {
                res.clearCookie('caboose-device-id');
                res.clearCookie('caboose-session');
                throw null;
            }

            let deviceToken = jsonwebtoken.verify(req.cookies['caboose-device-id'], UNIVERSAL.JWT_SECRET) as JwtPayload;

            if (!deviceToken) {
                res.clearCookie('caboose-device-id');
                res.clearCookie('caboose-session');
                throw null;
            }

            const device = await this.prisma.device.findUnique({
                where: {
                    deviceId: deviceToken.deviceId
                }
            });

            if (!device) {
                res.clearCookie('caboose-device-id');
                res.clearCookie('caboose-session');
                throw null;
            }

            if (!req.cookies['caboose-session']) {
                res.clearCookie('caboose-session');
                throw null;
            }

            let sessionToken = jsonwebtoken.verify(req.cookies['caboose-session'], UNIVERSAL.JWT_SECRET) as JwtPayload;

            if (!sessionToken) {
                res.clearCookie('caboose-session');
                throw null;
            }

            session = await this.prisma.session.findUnique({
                where: {
                    sessionId: sessionToken.sessionId
                },
                select: {
                    sessionId: true,
                    userId: true,
                    deviceId: true,
                    user: {
                        select: {
                            email: true,
                            emailVerified: true,
                            firstName: true,
                            lastName: true,
                            image: true
                        }
                    },
                    device: {
                        select: {
                            deviceName: true,
                            deviceOS: true
                        }
                    }
                }
            });

            if (!session) {
                res.clearCookie('caboose-session');
                throw null;
            }

            isAuthed = true;
        } catch (error) {
            isAuthed = false;
        }

        if (isAuthed) {
            return session;
        } else {
            return null;
        }

    }

    public async authenticationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {

        let isAuthed = await this.verifySession(req, res);

        if (isAuthed) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }

    }

}