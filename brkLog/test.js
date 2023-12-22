
const path = require("node:path")
const {Logger, LogConfig} = require("./index");

async function init_logger() {
    const logger = Logger.with_config(LogConfig.from_file(path.join(__dirname, "config.json")));
    logger.debug("hi")
    await logger.init()
    return logger
}

async function main() {
    let logger = await init_logger()
    setInterval(() => {
        logger.critical("ono")
    }, 1000);

}
main()