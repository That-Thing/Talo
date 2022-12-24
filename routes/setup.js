var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const config = require('../modules/config');
const errors = require('../modules/errors');
const mysql = require('mysql');
const {body} = require("express-validator");
const fs = require('fs');
// router.use(function(req, res, next) { //Middleware to check if user is logged in
//     if(config.server.setupLock == true) { //Create 404 if setupLock is enabled.
//         next(createError(404));
//     }
// });
router.get("/", function(req, res, next) {
    console.log("Setup page");
    return res.render('setup/setup', {config: config}); //Render setup
});
router.get("/step/:step", function(req, res) {
    if(req.params.step < 5) {
        return res.render('setup/step' + req.params.step, {config: config}); //Render setup
    } else {
        return res.redirect('/setup');
    }
});



router.post("/step/1", body('dbhost').not().isEmpty().trim().escape(), body('dbuser').not().isEmpty().trim().escape(), body('dbpassword').not().isEmpty().trim().escape(), body('dbname').not().isEmpty().trim().escape(), function(req, res) {
    const connection = mysql.createConnection({ //Create connection to database using provided credentials
        host: req.body.dbhost,
        user: req.body.dbuser,
        password: req.body.dbpassword,
        multipleStatements: true //Allow multiple statements in one query
    });
    connection.connect(function(err) {
        if (err) {//Return error json if connection fails
            return res.status(400).json({ error: err });
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
        console.log(sql);
        connection.query(sql, function (err, result) { //Execute database.sql
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(200).json({ success: true });
        });
    });
});




module.exports = router;