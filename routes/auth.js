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

/**
 * Login
 * @param {string} username
 * @param {string} password
 * @returns {json} status
 */
router.post('/login', body('username').not().isEmpty().trim().escape(), body('password').not().isEmpty().trim().escape(), function(req, res, next) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({ status: errs.array() });
    }
    var username = req.body.username;
    var password = crypto.createHash('sha256').update(req.body.password+config.server.salt).digest('base64');
    connection.query(`SELECT * FROM accounts WHERE username = '${username}'`, function (error, result) {
        if (error) throw error;
        if (result.length == 0) { //No account found
            return res.status(400).json({ status: errors.auth.invalidUsername });
        }
        if(result.length > 0) { //Account found
            if (result[0].password == password) { //Password matches
                req.session.user = result[0].id;
                req.session.username = result[0].username;
                req.session.loggedIn = true;
                req.session.group = result[0].perms;
                return res.status(200).json({status: true});
            } else { //Password doesn't match
                return res.status(400).json({ status: errors.auth.invalidPassword });
            }            
        }
    });
});

/**
 * Register
 * @param {string} username
 * @param {string} password
 * @param {string} confirm
 * @param {invite} invite
 * @returns {json} status
 */
router.post('/register', body('username').not().isEmpty().trim().escape(), body('password').not().isEmpty().trim().escape(), body('confirm').not().isEmpty().trim().escape(), body('invite').optional({checkFalsy: true}).not().isEmpty().escape(), function(req, res, next) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({ status: errs.array() });
    }
    if(config.accounts.registration.enabled == false) {
        return res.status(400).json({ status: errors.auth.registrationDisabled });
    }
    var username = req.body.username;
    var password = req.body.password;
    var confirm = req.body.confirm;
    var invite = req.body.invite;
    if(/^[a-zA-Z0-9]+$/.test(username) == false) { //Check for invalid characters in username
        return res.status(400).json({ status: errors.auth.invalidUsernameCharacters });
    }
    if(password != confirm) { //Check if passwords match
        return res.status(400).json({ status: errors.auth.passwordMismatch });
    }
    password = crypto.createHash('sha256').update(req.body.password+config.server.salt).digest('base64');
    connection.query(`SELECT * FROM accounts WHERE username = '${username}'`, function (error, result) {
        if (error) throw error;
        if (result.length > 0) { //Account already exists
            return res.status(400).json({ status: errors.auth.usernameTaken });
        }
        if (result.length == 0) { //Account doesn't exist
            if(config.accounts.registration.inviteOnly == true) { //Invite only is enabled
                connection.query(`SELECT * FROM invites WHERE invite='${invite}'`, function (error, result) {
                    if (error) throw error;
                    if (result.length == 0) { //Invite doesn't exist
                        return res.status(400).json({ status: errors.auth.invalidInvite });
                    }
                    connection.query(`INSERT INTO accounts (username, password) VALUES ('${username}', '${password}')`, function (error, result) {
                        if (error) throw error;
                        connection.query(`UPDATE invites SET uses = uses + 1 WHERE invite = '${invite}'`, function (error, result) { //Update invite uses
                            if (error) throw error;
                            return res.status(200).json({status: true});
                        });
                    });
                });
            } else {
                connection.query(`INSERT INTO accounts (username, password) VALUES ('${username}', '${password}')`, function (error, result) {
                    if (error) throw error;
                    return res.status(200).json({ status: true });
                });
            }
        }
    });
});

/**
 * Logout
 * @returns {json} status
 */
router.post('/logout', function(req, res, next) {
    req.session.destroy();
    return res.status(200).json({ status: true });
});
module.exports = router;
