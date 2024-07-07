import logger from '@logger';

import isDocker from 'is-docker';
import path from 'path';
import os from 'os';
import fs from 'fs';

type ENVIRONMENT = {
    CABOOSE_SERVER_ENV: string;
    CABOOSE_SERVER_TYPE: string;
    CABOOSE_SERVER_OS: NodeJS.Platform,
    CABOOSE_SRC_DIR: string;
    CABOOSE_CONTENT_DIR: string;
    CABOOSE_DATA_DIR: string;
    CABOOSE_CONFIG_DIR: string;
    CABOOSE_CONFIG_PATH: string;
    CABOOSE_DEFAULT_CONFIG_PATH: string;
    CABOOSE_PLUGIN_DIR: string;
    CABOOSE_LOG_DIR: string;
    CABOOSE_DATABASE_DIR: string;
    CABOOSE_DATABASE_TYPE: "sqlite"
    CABOOSE_DATABASE_PATH: string;
    CABOOSE_DATABASE_SCHEMA: string;
    CABOOSE_PRISMA_URL: string;
};

const environment: ENVIRONMENT = {
    CABOOSE_SERVER_ENV: "",
    CABOOSE_SERVER_TYPE: "",
    CABOOSE_SERVER_OS: os.platform(),
    CABOOSE_SRC_DIR: "",
    CABOOSE_CONTENT_DIR: "",
    CABOOSE_DATA_DIR: "",
    CABOOSE_CONFIG_DIR: "",
    CABOOSE_CONFIG_PATH: "",
    CABOOSE_DEFAULT_CONFIG_PATH: "",
    CABOOSE_PLUGIN_DIR: "",
    CABOOSE_LOG_DIR: "",
    CABOOSE_DATABASE_DIR: "",
    CABOOSE_DATABASE_TYPE: "sqlite",
    CABOOSE_DATABASE_PATH: "",
    CABOOSE_DATABASE_SCHEMA: "",
    CABOOSE_PRISMA_URL: "",
};

export function setupEnvironment(): void {
    logger.info("Setting up environment...");

    // Set up the server environment
    if (process.env.CABOOSE_SERVER_ENV == "development" || process.env.CABOOSE_SERVER_ENV == "production") {
        environment.CABOOSE_SERVER_ENV = process.env.CABOOSE_SERVER_ENV;
    } else {
        logger.error("No environment detected?!?! This should never happen, yet here we are...");
        logger.error("Please report this to the developers immediately!");
        logger.error("If you are a developer, please ensure you have not overwritten the CABOOSE_SERVER_ENV environment variable!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the server type
    if (isDocker()) {
        environment.CABOOSE_SERVER_TYPE = "docker";
    } else {
        environment.CABOOSE_SERVER_TYPE = "standalone";
    }

    // Set up the src directory
    environment.CABOOSE_SRC_DIR = path.resolve(path.join(__dirname, ".."));

    // Set up the content directory
    if (process.env.CABOOSE_CONTENT_DIR) {
        environment.CABOOSE_CONTENT_DIR = path.resolve(process.env.CABOOSE_CONTENT_DIR);
    } else {
        if (environment.CABOOSE_SERVER_TYPE == "docker") {
            environment.CABOOSE_CONTENT_DIR = path.resolve(path.join(__dirname, "..", "..", "..", "content"));
        } else {
            logger.error("No content directory detected! This is required for Caboose to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Set up the data directory
    if (process.env.CABOOSE_DATA_DIR) {
        environment.CABOOSE_DATA_DIR = path.resolve(process.env.CABOOSE_DATA_DIR);
    } else {
        if (environment.CABOOSE_SERVER_TYPE == "docker") {
            environment.CABOOSE_DATA_DIR = path.resolve(path.join(__dirname, "..", "..", "..", "data"));
        } else {
            if (environment.CABOOSE_SERVER_OS == "win32") {
                if (!process.env.LOCALAPPDATA) {
                    logger.error("LOCALAPPDATA environment variable not set! This is required for Caboose to run!");
                    logger.error("Shutting down...");
                    process.exit(1);
                }
                environment.CABOOSE_DATA_DIR = path.resolve(path.join(process.env.LOCALAPPDATA, "Caboose"));
            }
        }
    }

    // Create the data directory if it doesn't exist
    if (!fs.existsSync(environment.CABOOSE_DATA_DIR)) {
        try {
            fs.mkdirSync(environment.CABOOSE_DATA_DIR);
        } catch (error) {
            logger.error("Data directory could not be created! This is required for Caboose to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the data directory is writable
    try {
        fs.accessSync(environment.CABOOSE_DATA_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Data directory is not writable! This is required for Caboose to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the config directory
    environment.CABOOSE_CONFIG_DIR = path.resolve(path.join(environment.CABOOSE_DATA_DIR, "configs"));

    // Create the config directory if it doesn't exist
    if (!fs.existsSync(environment.CABOOSE_CONFIG_DIR)) {
        try {
            fs.mkdirSync(environment.CABOOSE_CONFIG_DIR);
        } catch (error) {
            logger.error("Config directory could not be created! This is required for Caboose to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the config directory is writable
    try {
        fs.accessSync(environment.CABOOSE_CONFIG_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Config directory is not writable! This is required for Caboose to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the config path
    environment.CABOOSE_CONFIG_PATH = path.resolve(path.join(environment.CABOOSE_CONFIG_DIR, "caboose.json"));

    // Set up the default config path
    environment.CABOOSE_DEFAULT_CONFIG_PATH = path.resolve(path.join(environment.CABOOSE_SRC_DIR, "managers", "ConfigManager", "default.json"));

    // Set up the plugin directory
    environment.CABOOSE_PLUGIN_DIR = path.resolve(path.join(environment.CABOOSE_DATA_DIR, "plugins"));

    // Create the plugin directory if it doesn't exist
    if (!fs.existsSync(environment.CABOOSE_PLUGIN_DIR)) {
        try {
            fs.mkdirSync(environment.CABOOSE_PLUGIN_DIR);
        } catch (error) {
            logger.error("Plugin directory could not be created! This is required for Caboose to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the plugin directory is writable
    try {
        fs.accessSync(environment.CABOOSE_PLUGIN_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Plugin directory is not writable! This is required for Caboose to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the log directory
    environment.CABOOSE_LOG_DIR = path.resolve(path.join(environment.CABOOSE_DATA_DIR, "logs"));

    // Create the log directory if it doesn't exist
    if (!fs.existsSync(environment.CABOOSE_LOG_DIR)) {
        try {
            fs.mkdirSync(environment.CABOOSE_LOG_DIR);
        } catch (error) {
            logger.error("Log directory could not be created! This is required for Caboose to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the log directory is writable
    try {
        fs.accessSync(environment.CABOOSE_LOG_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Log directory is not writable! This is required for Caboose to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the database directory
    environment.CABOOSE_DATABASE_DIR = path.resolve(path.join(environment.CABOOSE_DATA_DIR, "databases"));

    // Create the database directory if it doesn't exist
    if (!fs.existsSync(environment.CABOOSE_DATABASE_DIR)) {
        try {
            fs.mkdirSync(environment.CABOOSE_DATABASE_DIR);
        } catch (error) {
            logger.error("Database directory could not be created! This is required for Caboose to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the database directory is writable
    try {
        fs.accessSync(environment.CABOOSE_DATABASE_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Database directory is not writable! This is required for Caboose to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the database path
    if (environment.CABOOSE_DATABASE_TYPE == "sqlite") {
        environment.CABOOSE_DATABASE_PATH = path.resolve(path.join(environment.CABOOSE_DATABASE_DIR, "caboose.sqlite"));
    } else {
        logger.error("Database type not supported yet! Shutting down...");
        process.exit(1);
    }

    // Set up the database schema
    if (environment.CABOOSE_DATABASE_TYPE == "sqlite") {
        environment.CABOOSE_DATABASE_SCHEMA = path.resolve(path.join(environment.CABOOSE_SRC_DIR, "managers", "DatabaseManager", "SQLiteManager", "schema.prisma"));
    } else {
        logger.error("Database type not supported yet! Shutting down...");
        process.exit(1);
    }

    // Set up the Prisma URL
    if (environment.CABOOSE_DATABASE_TYPE == "sqlite") {
        environment.CABOOSE_PRISMA_URL = `file:${environment.CABOOSE_DATABASE_PATH}`;
    } else {
        logger.error("Database type not supported yet! Shutting down...");
        process.exit(1);
    }

    // set the process environment variables
    for (const key in environment) {
        process.env[key] = environment[key as keyof ENVIRONMENT];
    }

    console.log(environment);
    console.log(process.env);

    logger.info("Environment setup complete!");
}

export default environment;