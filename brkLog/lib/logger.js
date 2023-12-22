const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");
const path = require("node:path")
const fs = require('node:fs/promises')
const helpers = require("./utils/helpers")


class Logger {
    /**
     * @type {LogConfig}
     */
    #config;
    
    /**
     * @type {fs.FileHandle}
     */
    #log_file_handle;

    async init() {
        const log_dir = helpers.create_dir("logs")
        const now = new Date()
        const time = now.toTimeString().split(" ")[0].replace(/[\.:]+/g, "-")
        const file_name = this.#config.file_prefix + now.toISOString().split("T")[0] + "_"+ time + ".log"
        this.#log_file_handle = await fs.open(path.join(log_dir, file_name), "a+")
    }
    
    constructor(log_config) {
        log_config = log_config || LogConfig.with_defaults()
        LogConfig.assert(log_config);
        this.#config = log_config
    }

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


    get level()          { return this.#config.level }
    get file_prefix()    { return this.#config.file_prefix }
    get time_threshold() { return this.#config.rolling_config.time_threshold }
    get size_threshold() { return this.#config.rolling_config.size_threshold }

    debug    (message) { this.#log(LogLevel.Debug,    message)}
    info     (message) { this.#log(LogLevel.Info,     message)}
    warning  (message) { this.#log(LogLevel.Warning,  message)}
    error    (message) { this.#log(LogLevel.Error,    message)}
    critical (message) { this.#log(LogLevel.Critical, message)}

    async #log(level, message) {
        if (level < this.level) {
            return    
        }
        
        let now = new Date()
        let call_stack = helpers.get_callstack()
        let date = now.toISOString().split("T")[0]
        let time = now.toTimeString().split(" ")[0]
        let logText = `${date}_${time}:: ${LogLevel.to_string(level)} ${message} \n${call_stack.split(" ")[1]}`
        
        
        fs.writeFile(this.#log_file_handle, `${logText}\n`)
        console.log(logText)
        await this.#roll_check()
    }


    async #roll_check() {
        const { size_threshold, time_threshold} = this.#config.rolling_config

        const {size, birthtimeMs} = await this.#log_file_handle.stat();
        const current_time = new Date().getTime()
        if (size >= size_threshold || current_time - birthtimeMs > time_threshold * 1000) {
            await this.#log_file_handle.close()
            await this.init()
        }

    }

}
module.exports = {Logger};