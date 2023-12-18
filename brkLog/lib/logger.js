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
    #level = LogLevel.Info;
    constructor(loglevel) {
        if (arguments.length > 0) {
            LogLevel.assert(loglevel)
            this.#level = loglevel
        }
    }

    get level() { return this.#level }
}