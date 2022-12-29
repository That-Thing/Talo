var express = require('express');
var router = express.Router();
const config = require('../modules/config.js');

/**
 * GET /cmd/motd
 * Get message of the day from the config
 * @return {string} message of the day
 */
router.get('/motd', function(req, res, next) {
    if(config.motd.enabled === true) {
        return res.send(config.motd.message);
    }
});

module.exports = router;
