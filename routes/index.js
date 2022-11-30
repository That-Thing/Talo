var express = require('express');
var router = express.Router();
const config = require('../modules/config');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {config: config});
});
router.get('/login', function(req, res, next) {
  res.render('login', {config: config});
  
});


module.exports = router;
