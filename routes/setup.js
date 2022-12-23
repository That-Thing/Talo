var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const config = require('../modules/config');
const errors = require('../modules/errors');
const connection = require('../modules/connection');
// router.use(function(req, res, next) { //Middleware to check if user is logged in
//     if(config.server.setupLock == true) { //Create 404 if setupLock is enabled.
//         next(createError(404));
//     }
// });
router.get("/", function(req, res) {
    console.log("Setup page");
    return res.render('setup/setup', {config: config}); //Render setup
});
router.get("/step/:step", function(req, res) {
    return res.render('setup/step' + req.params.step, {config: config}); //Render setup
});
module.exports = router;