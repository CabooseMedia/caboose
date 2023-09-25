"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp } = winston_1.default.format;
const logDir = path_1.default.resolve(__dirname, '../../../data/logs');
const loggerFormat = winston_1.default.format.printf(({ level, message, timestamp }) => {
    return `[TIME:${timestamp}] [LEVEL:${level}]: ${message}`;
});
const logger = winston_1.default.createLogger({
    level: (_a = process.env.LOG_LEVEL) !== null && _a !== void 0 ? _a : 'silly',
    format: combine(timestamp(), loggerFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: `${logDir}/caboose.log`, level: 'silly', options: { flags: 'w' } }),
    ]
});
logger.debug('Logger initialized');
exports.default = logger;
