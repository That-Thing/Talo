var express = require('express');
var router = express.Router();
const { connect } = require('http2');
const connection = require('../modules/connection');
const { body, validationResult } = require('express-validator');
const config = require('../modules/config');
const errors = require('../modules/errors');
const crypto = require("crypto");
const url = require("url");
router.use(function(req, res, next) {
    req.session.path = url.parse(req.url).path;
    next();
});
router.get('/', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/auth/login');
    }
    connection.query(`SELECT * FROM accounts WHERE id = '${req.session.user}'`, function (error, result) { //Get user data
        if (error) throw error;
        let user = result[0];
        res.render('settings', {config: config, session: req.session, user: user});
    });
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