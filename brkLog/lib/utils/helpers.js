const fs_sync = require("node:fs");
const path = require("path");

/**
 * @returns The path to the directory within the package
 */
function create_dir(dir_path) {
    const target_dir = path.resolve(require.main.path, dir_path);
    if (!fs_sync.existsSync(target_dir)) {
        fs_sync.mkdirSync(target_dir, {recursive: true});
    }
    return target_dir
}

function get_callstack() {
    const error = {};
    Error.captureStackTrace(error);
    const caller_frame = error.stack.split("\n")[4]
    const meta_data = caller_frame.split("at ").pop()
    return meta_data
}

module.exports = {
    create_dir,
    get_callstack
};