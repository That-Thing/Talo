const fs = require('fs'); //filesync
function reloadErrors() {
    errors = JSON.parse(fs.readFileSync('config/errors.json'));
    return errors;
}
let errors = reloadErrors();
module.exports = errors;