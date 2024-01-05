import 'dotenv/config';
import './util/alias';

import path from 'path';

import logger from '@logger';
import { CabooseServer } from '@caboose/server';
import { UNIVERSAL } from '@util/universal';

logger.debug("All imports loaded successfully. Starting Caboose...");

async function start() {

    logger.info("Welcome to Caboose! Getting things ready...");

    UNIVERSAL.ROOT_DIR = path.resolve(__dirname, '..', '..');
    UNIVERSAL.CONTENT_DIR = path.resolve(UNIVERSAL.ROOT_DIR, 'content');
    UNIVERSAL.DATA_DIR = path.resolve(UNIVERSAL.ROOT_DIR, 'data');

    UNIVERSAL.CERTS_DIR = path.resolve(UNIVERSAL.DATA_DIR, 'certs');
    UNIVERSAL.LOGS_DIR = path.resolve(UNIVERSAL.DATA_DIR, 'logs');
    UNIVERSAL.WEB_DIR = path.resolve(UNIVERSAL.DATA_DIR, 'web');

    UNIVERSAL.HOST_WEB = ((process.env.HOST_WEB ?? "true") === "true");
    UNIVERSAL.AUTOUPDATE_WEB = ((process.env.AUTOUPDATE_WEB ?? "true") === "true");

    const caboose = new CabooseServer();

    await caboose.start();

    logger.info("Caboose is ready! Enjoy!");

}

start();