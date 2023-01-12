const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const config = require('../modules/config');
const errors = require('../modules/errors');
const mysql = require('mysql');
const {body, validationResult} = require("express-validator");
const fs = require('fs');
const crypto = require("crypto");
router.get("/", function(req, res, next) {
    return res.render('setup/setup', {config: config}); //Render setup
});
router.get("/step/:step", function(req, res) {
    if(req.params.step < 5) {
        return res.render('setup/step' + req.params.step, {config: config}); //Render setup
    } else {
        return res.redirect('/setup');
    }
});


/***
 * Step 1: Database setup
 * @param {string} dbhost
 * @param {string} dbuser
 * @param {string} dbpass
 * @return {json} status
 */
router.post("/step/1", body('dbhost').not().isEmpty().trim().escape(), body('dbuser').not().isEmpty().trim().escape(), body('dbpassword').not().isEmpty().trim().escape(), function(req, res) {
    let connection = mysql.createConnection({ //Create connection to database using provided credentials
        host: req.body.dbhost,
        user: req.body.dbuser,
        password: req.body.dbpassword,
        multipleStatements: true //Allow multiple statements in one query
    });
    connection.connect(function(err) {
        if (err) {//Return error json if connection fails
            return res.status(400).json({ error: err.sqlMessage });
        }
        config.database.host = req.body.dbhost;
        config.database.user = req.body.dbuser;
        config.database.password = req.body.dbpassword;
        fs.writeFile('./config/config.json', JSON.stringify(config, null, 4), function (err) { //Write db config to config.json
            if (err) {
                return res.status(400).json({ error: err });
            }
        });
        let sql = fs.readFileSync('database.sql').toString(); //Read database.sql
        connection.query(sql, function (err, result) { //Execute database.sql
            if (err) {
                return res.status(400).json({ error: err.sqlMessage });
            }
            return res.status(200).json({ success: true });
        });
    });
});
/***
 * Step 2: Configuration setup
 * @param {string} email
 * @param {string} salt
 * @param {boolean} minify
 * @param {string} logo
 * @param {string} favicon
 * @param {string} title
 * @param {string} description
 * @param {string} keywords
 * @param {string} author
 * @param {string} contactemail
 * @param {boolean} registration
 * @param {boolean} emailVerfication
 * @param {boolean} invites
 * @param {number} minPasswordLength
 * @param {boolean} motd
 * @param {string} motdMessage
 * @return {json} status
 */
router.post("/step/2",
    body('email').not().isEmpty().trim(),
    body('salt').not().isEmpty().trim(),
    body('minify').not().isEmpty().isBoolean(),
    body('logo').not().isEmpty().trim(),
    body('favicon').not().isEmpty().trim(),
    body('title').not().isEmpty().trim(),
    body('description').not().isEmpty().trim(),
    body('keywords').not().isEmpty().trim(),
    body('author').not().isEmpty().trim(),
    body('contactemail').not().isEmpty().trim(),
    body('registration').not().isEmpty().isBoolean(),
    body('emailVerfication').not().isEmpty().isBoolean(),
    body('invites').not().isEmpty().isBoolean(),
    body('minPasswordLength').not().isEmpty().trim(),
    body('motd').not().isEmpty().isBoolean(),
    body('motdMessage').not().isEmpty().trim(),
    function(req, res) {
        config.server.email = req.body.email;
        config.server.salt = req.body.salt;
        if(config.server.salt === "") { //Generate random salt if none is provided
            config.server.salt = crypto.randomBytes(64).toString('hex').substring(0, 64);
        }
        if(req.body.minify === "true") {
            config.web.minify = true;
        } else {
            config.web.minify = false;
        }
        config.branding.logo = req.body.logo;
        config.branding.favicon = req.body.favicon;
        config.branding.title = req.body.title;
        config.branding.description = req.body.description;
        config.branding.keywords = req.body.keywords;
        config.branding.author = req.body.author;
        config.branding.contactemail = req.body.contactemail;
        if(req.body.registration === "true") {
            config.accounts.registration.enabled = true;
        } else {
            config.accounts.registration.enabled = false;
        }
        if(req.body.emailVerfication === "true") {
            config.accounts.registration.emailVerification = true;
        } else {
            config.accounts.registration.emailVerification = false;
        }
        if(req.body.invites === "true") {
            config.accounts.registration.invites = true;
        } else {
            config.accounts.registration.invites = false;
        }
        config.accounts.registration.minPasswordLength = parseInt(req.body.minPasswordLength);
        if(req.body.motd === "true") {
            config.server.motd = true;
        } else {
            config.server.motd = false;
        }
        config.motd.message = req.body.motdMessage;
        fs.writeFile('./config/config.json', JSON.stringify(config, null, 4), function (err) { //Write config to config.json
            if (err) {
                return res.status(400).json({error: err});
            }
            return res.status(200).json({success: true});
        });
    });
/***
 * Step 3: Admin account setup
 * @param {string} username
 * @param {string} password
 * @param {string} password2 (repeat password)
 * @return {json} status
 */
router.post("/step/3", body('username').not().isEmpty().trim().escape(), body('password').not().isEmpty().trim().escape(), body('password2').not().isEmpty().trim().escape(), function(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({ status: errs.array() });
    }
    if(req.body.password !== req.body.password2) { //Check if passwords match
        return res.status(400).json({ error: errors.invalidPasswordConfirmation });
    }
    let connection = mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name
    });
    let username = req.body.username;
    let password = crypto.createHash('sha256').update(req.body.password+config.server.salt).digest('base64').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''); //Hash password
    let token = crypto.createHash('sha256').update(username+password+config.server.salt).digest('base64').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''); //Create user token
    let ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    let date = Date.now();
    if(/^[a-zA-Z0-9]+$/.test(username) === false) { //Check for invalid characters in username
        return res.status(400).json({ status: errors.auth.invalidUsernameCharacters });
    }
    connection.query(`INSERT INTO accounts (\`group\`, username, password, token, date, ip) VALUES (3, '${username}', '${password}', '${token}', ${date}, '${ip}')`, function (err, result) {
        if (err) {
            return res.status(400).json({error: err.sqlMessage});
        }
        connection.query(`UPDATE accounts SET id=0 WHERE id=1`, function (err, result) { //Set root account id to 0
            if (err) {
                return res.status(400).json({error: err.sqlMessage});
            }
            return res.status(200).json({success: true});
        });
    });
});
/***
 * Step 4: Finish setup and exit program.
 * @return {json} status
 */
router.post("/step/4", function(req, res) {
    config.server.setupLock = true;
    fs.writeFile('./config/config.json', JSON.stringify(config, null, 4), function (err) {
        if (err) {
            return res.status(400).json({error: err});
        }
        res.status(200).json({success: true});
        process.exit(1);
    });
});
module.exports = router;