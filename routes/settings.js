var express = require('express');
var router = express.Router();
const { connect } = require('http2');
const connection = require('../modules/connection');
const { body, validationResult } = require('express-validator');
const config = require('../modules/config');
const errors = require('../modules/errors');
const crypto = require("crypto");



router.get('/', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/auth/login');
    }
    res.render('settings', {config: config, session: req.session});
});



router.post('/update',
    body('password').not().isEmpty().trim().escape(),
    body('confirm').not().isEmpty().trim().escape(),
    function(req, res, next) {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
            return res.status(400).json({ status: errs.array() });
        }
        if(req.body.password !== req.body.confirm) { //Passwords don't match
            return res.status(400).json({ status: errors.auth.invalidPasswordConfirmation });
        }
        let password = crypto.createHash('sha256').update(req.body.password+config.server.salt).digest('base64').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    });




module.exports = router;