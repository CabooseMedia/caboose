import winston from 'winston';
import path from 'path';

import chalk from 'chalk';

const { combine, timestamp } = winston.format;

const logDir = path.resolve(__dirname, '../../../data/logs');

function colorize(level: string, message: string): string {
    switch (level) {
        case 'silly':
            return chalk.magentaBright(message);
        case 'debug':
            return chalk.cyanBright(message);
        case 'verbose':
            return chalk.blueBright(message);
        case 'info':
            return chalk.greenBright(message);
        case 'warn':
            return chalk.yellowBright(message);
        case 'error':
            return chalk.redBright(message);
        default:
            return message;
    }
}

const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[TIME:${timestamp}] [LEVEL:${colorize(level, level)}]: ${colorize(level, message)}`;
});

const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[TIME:${timestamp}] [LEVEL:${level}]: ${message}`;
});

const LEVEL: string = process.env.LOG_LEVEL ?? 'info';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: LEVEL, format: combine(timestamp(), consoleFormat) }),
        new winston.transports.File({ filename: `${logDir}/caboose.log`, level: 'debug', options: { flags: 'w' }, format: combine(timestamp(), fileFormat) }),
    ]
});

logger.silly('Logger successfully imported and initialized.');

export default logger;