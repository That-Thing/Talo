const fs = require('fs'); //filesync
let errors = JSON.parse(fs.readFileSync('config/errors.json'));
function reloadErrors() {
    errors = JSON.parse(fs.readFileSync('config/errors.json'));
    return errors;
}
module.exports = errors;