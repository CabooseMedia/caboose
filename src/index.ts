import 'dotenv/config';
import './util/alias';

import selfsigned from 'selfsigned';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import logger from '@logger';
import { CabooseServer } from '@caboose/server';
import { UNIVERSAL } from '@util/universal';

logger.debug("All imports loaded successfully. Starting Caboose...");

async function start() {

    logger.info("Welcome to Caboose! Getting things ready...");

    UNIVERSAL.ROOT_DIR = path.resolve(__dirname, '..', '..');
    UNIVERSAL.CONTENT_DIR = path.resolve(UNIVERSAL.ROOT_DIR, 'content');
    UNIVERSAL.DATA_DIR = path.resolve(UNIVERSAL.ROOT_DIR, 'data');

    const serverManager = new CabooseServer();

    await serverManager.start();

    logger.info("Caboose is ready! Enjoy!");

}

start();