import winston from 'winston';
import path from 'path';

const { combine, timestamp } = winston.format;

const logDir = path.resolve(__dirname, '../../../data/logs');


const loggerFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[TIME:${timestamp}] [LEVEL:${level}]: ${message}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? 'silly',
    format: combine(
        timestamp(),
        loggerFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${logDir}/caboose.log`, level: 'silly', options: { flags: 'w' } }),
    ]
});

logger.debug('Logger initialized');

export default logger;