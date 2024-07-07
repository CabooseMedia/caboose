import Manager from "@caboose/manager"
import environment from "@environment"
import fs from "fs"
import path from "path"

export default class ConfigManager extends Manager {

    public initialize(): void {
        
    }

    public async setup(): Promise<void> {
        fs.writeFileSync(environment.CABOOSE_CONFIG_PATH, fs.readFileSync(environment.CABOOSE_DEFAULT_CONFIG_PATH, "utf8"))
        if (!fs.existsSync(environment.CABOOSE_CONFIG_PATH)) {
            // write default config
        }
    }

    public async start(): Promise<void> {
        
    }

    public async stop(): Promise<void> {

    }

}