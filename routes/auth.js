var express = require('express');
var router = express.Router();
const { connect } = require('http2');
const connection = require('../modules/connection');
const crypto = require("crypto");
const { body, validationResult } = require('express-validator');
const config = require('../modules/config');
const errors = require('../modules/errors');
//Login page
router.get('/login', function(req, res, next) {
    res.render('login', {config: config});
});
//Register page
router.get('/register', function(req, res, next) {
    res.render('register', {config: config});
});


//Login request
router.post('/login', body('username').not().isEmpty().trim().escape(), body('password').not().isEmpty().trim().escape(), function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    var username = req.body.username;
    var password = req.body.password;
    password = crypto.createHash('sha256').update(password+config.server.salt).digest('base64'); 
    connection.query(`SELECT * FROM accounts WHERE username = '${username}'`, function (error, result) {
        if (error) throw error;
        if (result.length == 0) { //No account found
            return res.status(400).json({ status: errors.auth.invalidUsername });
        }
        if(result.length > 0) { //Account found
            if (result[0].password == password) { //Password matches
                req.session.loggedin = true;
                req.session.username = username;
                return res.status(200).json({status: true});
            } else { //Password doesn't match
                return res.status(400).json({ status: errors.auth.invalidPassword });
            }            
        }
    });
});

//Register request
router.post('/register', body('username').not().isEmpty().trim().escape(), body('password').not().isEmpty().trim().escape(), body('invite').optional({checkFalsy: true}).not().isEmpty().escape(), function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(config.accounts.registration.enabled == false) {
        return res.status(400).json({ status: errors.auth.registrationDisabled });
    }
    var username = req.body.username;
    var password = req.body.password;
    var invite = req.body.invite;
    var password = crypto.createHash('sha256').update(req.body.password+config.server.salt).digest('base64');
    connection.query(`SELECT * FROM accounts WHERE username = '${username}'`, function (error, result) {
        if (error) throw error;
        if (result.length > 0) { //Account already exists
            return res.status(400).json({ status: errors.auth.accountExists });
        }
        if (result.length == 0) { //Account doesn't exist
            if(config.accounts.registration.inviteOnly == true) {
                if (invite == config.accounts.registration.inviteCode) {
                    connection.query(`INSERT INTO accounts (username, password) VALUES ('${username}', '${password}')`, function (error, result) {
                        if (error) throw error;
                        return res.status(200).json({ status: true });
                    });
                } else {
                    return res.status(400).json({ status: errors.auth.invalidInvite });
                }
            } else {
                connection.query(`INSERT INTO accounts (username, password) VALUES ('${username}', '${password}')`, function (error, result) {
                    if (error) throw error;
                    return res.status(200).json({ status: true });
                });
            }
        }
    });

});

module.exports = router;
