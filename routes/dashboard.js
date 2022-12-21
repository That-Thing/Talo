var express = require('express');
var router = express.Router();
const config = require('../modules/config');
const errors = require('../modules/errors');
const connection = require('../modules/connection');
const url = require("url");
router.use(function(req, res, next) { //Middleware to check if user is logged in
    if (!req.session.loggedIn) {
        return res.redirect('/auth/login');
    }
    req.session.path = url.parse(req.url).path; //Set path to current path
    next();
    console.log(req.session.group);
});

router.get("/", function(req, res) {
    connection.query(`SELECT * FROM accounts WHERE id = '${req.session.user}'`, function (error, result) { //Get user data
        if (error) throw error;
        var user = result[0];
        res.render('dashboard', {config: config, user: user, session: req.session}); //Render dashboard
    });
});

module.exports = router;
