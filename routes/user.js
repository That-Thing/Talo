var express = require('express');
var router = express.Router();
const { connect } = require('http2');
const connection = require('../modules/connection');
const { body, validationResult } = require('express-validator');
const config = require('../modules/config');
const errors = require('../modules/errors');

/***
 * Return user information
 * @param {string} id - User ID
 * @param {string} key - API key
 * @param {string} token - User Token
 * @returns {json} user information
 */
router.post("/:id", body('key').optional({checkFalsy: true}).trim().escape(), body('token').optional({checkFalsy: true}).escape().trim(), async function(req, res, next) {
    let id = req.params.id;
    let key = req.body.key;
    let token = req.body.token;
    let keyPerms;
    let userPerms;
    if(key === undefined && token === undefined) { //No key or token provided
        return res.status(400).json({error: errors.user.noAuth});
    }
    console.log("Key: " + key);
    console.log("Token: " + token);
    if(key !== undefined) { //Key is provided
        let keyQuery = await connection.query(`SELECT * FROM api_keys WHERE \`key\` = '${key}'`, function (error, result) {
            if (error) {
                return res.status(400).json({ error: error });
            }
            keyQuery = result;
        });
        if (keyQuery.length === 0) { //No key found
            return res.status(400).json({ error: errors.api.invalidKey });
        }
        keyPerms = keyQuery[0].perms; //Get key permissions
    }
    if(token !== undefined) { //Token is provided
        let tokenQuery = await connection.query(`SELECT * FROM accounts WHERE token = '${token}'`, function (error, result) {
            if (error) {
                return res.status(400).json({ error: error });
            }
            tokenQuery = result;
        });
        if (tokenQuery.length === 0) { //No token found
            return res.status(400).json({ error: errors.auth.invalidToken });
        }
        console.log(tokenQuery);
        userPerms = tokenQuery[0].group; //Get user permissions
    }
    connection.query(`SELECT * FROM accounts WHERE id = '${id}'`, function (error, result) {
        if (error) {
            return res.status(400).json({ error: error });
        }
        if (result.length == 0) { //No account found
            return res.status(400).json({ error: errors.user.invalidID });
        }
        let userJSON;
        if (keyPerms > 1 || userPerms > 1) { //Key or user has permission to view sensitive information
            userJSON = {
                id: result[0].id,
                username: result[0].username,
                group: result[0].group,
                email: result[0].email,
                invite: result[0].invite,
                date: result[0].date,
                ip: result[0].ip
            }
        } else {
            userJSON = {
                id: result[0].id,
                username: result[0].username,
                group: result[0].group,
                date: result[0].date
            }
        }
        return res.status(200).json({ user: userJSON });
    });
});


module.exports = router;