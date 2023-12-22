class RollingTimeOptions {
    static Minutely = 60;
    static Hourly   = 60 * this.Minutely;
    static Daily    = 24 * this.Hourly;
    static Weekly   =  7 * this.Daily;
    static Monthly  = 30 * this.Daily;
    static Yearly   = 12 * this.Monthly;

    static assert(time_interval) {
        if (![this.Minutely, this.Hourly, this.Daily, this.Weekly, this.Monthly, this.Yearly].includes(time_interval)) {
            throw new Error (
                `time_interval must be an instance of RollingConfig. Invalid Parameter: ${JSON.stringify(time_interval)}`);
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
                `size_threshold must be at least 1 KB. Invalid Parameter: ${JSON.stringify(size_threshold)}`);
        }
    }
}

module.exports = {
    RollingTimeOptions,
    RollingSizeOptions,
    
}