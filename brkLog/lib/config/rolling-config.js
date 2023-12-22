const {RollingTimeOptions, RollingSizeOptions} = require('../utils/rolling-options')

class RollingConfig {
    /**
     * Create a new log file when this time limit (in seconds) is reached
     * @type {RollingTimeOptions}
     * @private
     */
    #time_interval = RollingTimeOptions.Hourly
    /**
     * Create a new log file when this filesize is reached
     * @type {RollingSizeOptions}
     * @private
     */
    #size_interval = RollingSizeOptions.FiveMB

    static assert(rolling_config) {
        if (!(rolling_config instanceof RollingConfig)) {
            throw new Error (
                `rolling_config must be an instance of RollingConfig Invalid Parameter: ${JSON.stringify(rolling_config)}`);
        }
    }
    /**
     * @returns a new instance of RollingConfig with the default settings
     */
    static with_defaults() {
        return new RollingConfig
    }
    /**
     * @param {int} size_threshold 
     * @returns the current instance with the specified filesize threshold
     */
    with_size_threshold(size_threshold) {
        RollingSizeOptions.assert(size_threshold);
        this.#size_interval = size_threshold;
        return this
    }
    /**
     * @param {int} time_threshold The thresh
     * @returns the current instance with the specified time threshold
     */
    with_time_threshold(time_threshold) {
        RollingTimeOptions.assert(time_threshold);
        this.#time_interval = time_threshold
        return this
    }

    get time_threshold() {return this.#time_interval}
    get size_threshold() {return this.#size_interval}

    /**
     * @param {JSON} json 
     * @returns a RollingConfig instance with the settings from the specified JSON
     */
    static from_json(json) {
        let rolling_config = new RollingConfig();
        Object.keys(json).forEach((key) => {
            switch (key) {
                case "size_threshold":
                    console.log(`loading size threshold: ${json[key]}`)
                    rolling_config = rolling_config.with_size_threshold(json[key]);
                    break;
                    case "time_threshold":
                    console.log(`loading time threshold: ${json[key]}`)
                    rolling_config = rolling_config.with_time_threshold(json[key]);
                    break;
            }
        });
        return rolling_config
    }

}

module.exports = {RollingConfig}