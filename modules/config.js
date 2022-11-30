const fs = require('fs'); //filesync
function reloadConfig() {
    config = JSON.parse(fs.readFileSync('config/config.json'));
    return config;
}
let config = reloadConfig();
module.exports = config;