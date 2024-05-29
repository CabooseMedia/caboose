import { Manager } from '@caboose/managers';
import logger from "@logger";
import { UNIVERSAL } from '@util/universal';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import { path as ffprobePath } from '@ffprobe-installer/ffprobe'

export class TranscodeManager extends Manager {

    protected transcoder!: ffmpeg.FfmpegCommand | null;
    protected firstDataSend!: boolean;

    public initialize(): void {
        ffmpeg.setFfmpegPath(ffmpegPath);
        ffmpeg.setFfprobePath(ffprobePath);
        this.transcoder = null;
        this.firstDataSend = false;
    }

    public transcodeStream(req: Request, res: Response, filePath: string): void {
        // if (!this.transcoder) {
        //     let readStream = fs.createReadStream(filePath);
        //     this.transcoder = ffmpeg(readStream)
        //         .inputFormat('mp4')
        //         .withVideoCodec('libx264')
        //         .withAudioCodec('aac')
        //         .withAudioChannels(2)
        //         .toFormat('mp4')
        //         .outputOptions('-movflags frag_keyframe+empty_moov+faststart')
        //         .on('start', () => {
        //             logger.info('Transcode started.');
        //         })
        //         .on('progress', (progress: any) => {
        //             logger.info(`Transcode progress: ${progress.percent}%`);
        //             if (!this.firstDataSend) {
        //                 this.firstDataSend = true;
        //                 this.streamTranscodedFile(req, res, filePath, 'D:\\Coding\\Caboose\\content\\temptranscoding.mp4');
        //             }
        //         })
        //         .on('end', () => {
        //             logger.info('Transcode finished.');
        //             this.transcoder = null;
        //         })
        //         .on('error', (err: Error) => {
        //             logger.error(`Transcode error: ${err.message}`);
        //         })
        //         .save('D:\\Coding\\Caboose\\content\\temptranscoding.mp4');
        // } else {
        //     logger.info('Transcode already running.');
        //     this.streamTranscodedFile(req, res, filePath, 'D:\\Coding\\Caboose\\content\\temptranscoding.mp4');
        // }
        // if (!this.transcoder) {
        //     this.transcoder = ffmpeg(filePath)
        //         .videoCodec('libx264')
        //         .audioCodec('aac')
        //         .audioChannels(2)
        //         .format('dash')
        //         .on('start', () => {
        //             logger.info('Transcode started.');
        //         })
        //         .on('progress', (progress: any) => {
        //             logger.info(`Transcode progress: ${progress.percent}%`);
        //             if (!this.firstDataSend) {
        //                 this.firstDataSend = true;
        //                 res.sendFile('D:\\Coding\\Caboose\\content\\transcoding\\output.mpd');
        //             }
        //         })
        //         .on('end', () => {
        //             logger.info('Transcode finished.');
        //             this.transcoder = null;
        //         })
        //         .save('D:\\Coding\\Caboose\\content\\transcoding\\output.mpd')
        // } else {
        //     logger.info('Transcode already running.');
        //     res.sendFile('D:\\Coding\\Caboose\\content\\transcoding\\output.mpd');
        // }
        ffmpeg(filePath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('dash')
            .outputOptions([
                '-init_seg_name D:\\Coding\\Caboose\\content\\transcoding\\init_$RepresentationID$.m4s',
                '-media_seg_name D:\\Coding\\Caboose\\content\\transcoding\\chunk_$RepresentationID$_$Number%05d$.m4s',
                '-use_timeline 0'
            ])
            .on('start', () => {
                logger.info('Transcode started.');
            })
            .on('progress', (progress: any) => {
                logger.info(`Transcode progress: ${progress.percent}%`);
                res.sendFile('D:\\Coding\\Caboose\\content\\transcoding\\output.mpd');
            })
            .on('end', () => {
                logger.info('Transcode finished.');
            })
            .on('error', (err: Error) => {
                logger.error(`Transcode error: ${err.message}`);
            })
            .save('D:\\Coding\\Caboose\\content\\transcoding\\output.mpd');
    }

    public streamTranscodedFile(req: Request, res: Response, filePath: string): void {
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

        console.log('streaming');

        ffmpeg(stream)
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('dash')
            .outputOptions([
                '-init_seg_name init_$RepresentationID$.m4s',
                '-media_seg_name chunk_$RepresentationID$_$Number%05d$.m4s',
                '-adaptation_sets "id=0,streams=v id=1,streams=a"'
            ])
            .on('start', () => {
                logger.info('Transcode started.');
            })
            .on('progress', (progress: any) => {
                logger.info(`Transcode progress: ${progress}%`);
                console.log(progress);
            })
            .on('end', () => {
                logger.info('Transcode finished.');
            })
            .on('error', (err: Error) => {
                logger.error(`Transcode error: ${err.message}`);
            })
            .pipe(res, { end: true })
    }

}