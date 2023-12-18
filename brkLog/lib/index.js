const fs = require('node:fs')

class LogLevel {
    static Debug = 0;
    static Info = 1;
    static Warning = 2;
    static Error = 3;
    static Critical = 4;

    // throws error if the loglevel is invalid

    static assert(loglevel) {
        if (![LogLevel.Debug, LogLevel.Info, LogLevel.Warning, LogLevel.Error, LogLevel.Critical].includes(loglevel)) {
            throw new Error (
            `Parameter loglevel must be an instance of LogLevel. Invalid Parameter: ${JSON.stringify(loglevel)}`); 
        }
    
    
    }


}

class Logger {
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

class LogConfig {
    #level = LogLevel.Info;
    #rolling_config = RollingConfig.Hourly;
    #file_prefix = "brklog_"
    
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
     * @returns {LogConfig} The current instance of LogConfig.
     */
    with_log_level(log_level) {
        LogLevel.assert(log_level)
        this.#level = log_level
        return this
    }
    with_rolling_config(rolling_config) {
        RollingConfig.assert(rolling_config)
        this.#rolling_config = rolling_config
        return this
    }
    with_file_prefix(file_prefix) {
        if (typeof file_prefix !== "string") {
            throw new Error(
                `file_prefix must be a string. Invalid Parameter: ${JSON.stringify(file_prefix)}`);
            }
            this.#file_prefix = file_prefix
            return this
    }
    
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

    static from_file(file_path) {
        const file_contents = fs.readFileSync(file_path);
        return LogConfig.from_json(JSON.parse(file_contents))
    }
}


class RollingConfig {
    #time_interval = RollingTimeOptions.Hourly
    #size_interval = RollingSizeOptions.FiveMB

    static assert(rolling_config) {
        if (!(rolling_config instanceof RollingConfig)) {
            throw new Error (
                `rolling_config must be an instance of RollingConfig Invalid Parameter: ${JSON.stringify(rolling_config)}`);
        }
    }

    static with_defaults() {
        return new RollingConfig
    }

    with_size_threshold(size_threshold) {
        RollingSizeOptions.assert(size_threshold);
        this.#size_interval = size_threshold;
        return this
    }
    with_time_threshold(time_threshold) {
        RollingSizeOptions.assert(time_threshold);
        this.#time_interval = time_threshold
        return this
    }

    get time_threshold() {return this.#time_interval}
    get size_threshold() {return this.#size_interval}

    static from_json(json) {
        let rolling_config = new RollingConfig();
        Object.keys(json).forEach((key) => {
            switch (key) {
                case "size_threshold":
                    console.log(`RollingConfig.from_json(${json[key]})`)
                    rolling_config = rolling_config.with_size_threshold(json[key]);
                    break;
                case "time_threshold":
                    console.log(`RollingConfig.from_json(${json[key]})`)
                    rolling_config = rolling_config.with_time_threshold(json[key]);
                    break;
            }
        });
        return rolling_config
    }

}

class RollingTimeOptions {
    static Minutely = 60;
    static Hourly   = 60 * this.Minutely;
    static Daily    = 24 * this.Hourly;
    static Weekly   =  7 * this.Daily;
    static Monthly  = 30 * this.Daily;
    static Yearly   = 12 * this.Monthly;

    static assert(time_interval) {
        if (![this.Minutely, this.Hourly, this.Daily, this.Weekly, this.Monthly, this.Yearly].contains(time_interval)) {
            throw new Error (
                `time_interval must be an instance of RollingConfig Invalid Parameter: ${JSON.stringify(time_interval)}`);
        }
    }
}

class RollingSizeOptions {
    static OneKB     = 1024;
    static FiveKB    = 1024 * 5;
    static TenKB     = 1024 * 10;
    static TwentyKB  = 1024 * 20;
    static FiftyKB   = 1024 * 50;
    static HundredKB = 1024 * 100;

    static OneMB     = 1024 * 1024;
    static FiveMB    = 1024 * 1024 * 5;
    static TenMB     = 1024 * 1024 * 10;
    static TwentyMB  = 1024 * 1024 * 20;
    static FiftyMB   = 1024 * 1024 * 50;
    static HundredMB = 1024 * 1024 * 100;

    static assert(size_threshold) {
        if (typeof size_threshold !== "number" || size_threshold < RollingSizeOptions.OneKB) {
            throw new Error(
                `size_threshold must be at-least 1 KB. Invalid Parameter: ${JSON.stringify(size_threshold)}`);
        }
    }
}

module.exports = {
    LogLevel,
};

