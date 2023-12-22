const fs = require("node:fs")

const {LogLevel} = require("../utils/log-level")
const {RollingConfig} = require("./rolling-config")

class LogConfig {

    /**
     * @type {LogLevel}
     * @private
     * @description the loglevel for the logger. Value verified with LogLevel.assert(level)
     */
    #level = LogLevel.Info;
    
    
    /**
     * @type RollingConfig
     * @private
     */
    #rolling_config = RollingConfig.Hourly;

    /**
     * @type {string}
     * @private
     * @description Prefix for all the file names created by this logger
     */   
    #file_prefix = "brklog_"
    
    constructor() {
        this.#rolling_config = RollingConfig.with_defaults()
    }
    /**
     * @param {LogConfig} log_config 
     * @throws throws an error if the param is not a LogConfig instance
     */
    static assert(log_config) {
        if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
            throw new Error(
                `log_config must be an instance of LogConfig. Invalid Parameter: ${JSON.stringify(log_config)}`);
        }
    }
        
    get level() {return this.#level}
    get rolling_config() {return this.#rolling_config}
    get file_prefix() {return this.#file_prefix}
    
    /**
     * @param {LogLevel} log_level The log level to be set.
     * @returns {LogConfig} The current instance of LogConfig with the logLevel Updated.
     */
    with_log_level(log_level) {
        LogLevel.assert(log_level)
        this.#level = log_level
        return this
    }
    /**
     * @param {LogLevel} rolling_config The log level to be set.
     * @returns {LogConfig} The current instance of LogConfig with the updated rolling config.
     */
    with_rolling_config(rolling_config) {
        RollingConfig.assert(rolling_config)
        this.#rolling_config = rolling_config
        return this
    }
    /**
     * @param {string} file_prefix 
     * @returns The current instance
     */
    with_file_prefix(file_prefix) {
        if (typeof file_prefix !== "string") {
            throw new Error(
                `file_prefix must be a string. Invalid Parameter: ${JSON.stringify(file_prefix)}`);
            }
            this.#file_prefix = file_prefix
            return this
    }
    /**
     * @param {JSON} json 
     * @returns the current instance with settings from the specified JSON object
     */
    static from_json (json){
        let log_config = new LogConfig();
        Object.keys(json).forEach((key) => {
            switch (key) {
                case "level": 
                    log_config = log_config.with_log_level(json[key])
                    break;
                case "rolling_config": 
                    log_config = log_config.with_rolling_config(RollingConfig.from_json(json[key]))
                    break;
                case "file_prefix": 
                    log_config = log_config.with_file_prefix(json[key])
                    break;
            }
        });
        return log_config
    }
    /**
     * @returns a new instance of LogConfig with the default settings
     */
    static with_defaults() {
        return new LogConfig();
    }
    /**
     * @param {String} file_path 
     * @returns a new instance of LogConfig with the settings read from the specified JSON file
     */
    static from_file(file_path) {
        const file_contents = fs.readFileSync(file_path);
        return LogConfig.from_json(JSON.parse(file_contents))
    }
}

module.exports = {LogConfig}