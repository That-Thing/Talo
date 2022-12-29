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
    let password = crypto.createHash('sha256').update(req.body.password+config.server.salt).digest('base64'); //Hash password
    let token = crypto.createHash('sha256').update(username+password+config.server.salt).digest('base64'); //Create user token
    let ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    let date = Date.now();
    if(/^[a-zA-Z0-9]+$/.test(username) === false) { //Check for invalid characters in username
        return res.status(400).json({ status: errors.auth.invalidUsernameCharacters });
    }
    connection.query(`INSERT INTO accounts (group, username, password, token, date, ip) VALUES (3, '${username}', '${password}', '${token}', ${date}, '${ip}')`, function (err, result) {
        if (err) {
            return res.status(400).json({error: err.sqlMessage});
        }
        return res.status(200).json({success: true});
    });
});




module.exports = router;