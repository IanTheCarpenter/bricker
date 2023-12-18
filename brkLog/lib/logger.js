const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level.");

class Logger {
    /**
     * @type {LogConfig}
     */
    #config;


    /**
     * @returns {Logger} New instance of Logger with defaults
     */
    static with_defaults() {
        return new Logger();
    }


    /**
     * @param {LogConfig} log_config
     * @returns {Logger} New instance of Logger with the given config
     */
    static with_config(log_config) {
        return new Logger(log_config)
    }


    // instances of this object will be called to generate log messages
    constructor(log_config) {
        log_config = log_config || LogConfig.with_defaults()
        LogConfig.assert(log_config);
        this.#config = log_config
    }

    get level() { return this.#config.level }
}