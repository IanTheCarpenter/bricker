class LogLevel {
    static #Debug = 0;
    static #Info = 1;
    static #Warning = 2;
    static #Error = 3;
    static #Critical = 4;

    
    static get Debug()    { return this.#Debug;}
    static get Info()     { return this.#Info;}
    static get Warning()  { return this.#Warning;}
    static get Error()    { return this.#Error;}
    static get Critical() { return this.#Critical;}
    
    static assert(loglevel) {
        if (![LogLevel.Debug, LogLevel.Info, LogLevel.Warning, LogLevel.Error, LogLevel.Critical].includes(loglevel)) {
            throw new Error (
                `Parameter loglevel must be an instance of LogLevel. Invalid Parameter: ${JSON.stringify(loglevel)}`); 
            }
        }
        static to_string(log_level) {
            const levels = {
                [this.Debug]:    "   Debug   :",
                [this.Info]:     "   Info    :",
                [this.Warning]:  "  Warning  :",
                [this.Error]:    "   Error   :",
                [this.Critical]: "**CRITICAL**"
            }
            if (levels.hasOwnProperty(log_level)) {
                return levels[log_level]
            }
            throw new Error (`Log level not supported. Invalid Parameter: ${log_level}`)
        }
    }
    
    module.exports = { LogLevel }