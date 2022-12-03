var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const session = require('express-session');
const config = require('./modules/config');
//Routers
var indexRouter = require('./routes/index');
var cmdRouter = require('./routes/cmd');
var authRouter = require('./routes/auth');

// Initialize session
app.use(session({
	secret: config.server.salt,
	resave: true,
	saveUninitialized: true
}));

// Session middleware
function setSession (req, res, next) { 
  if (!req.session.loggedIn) {
    req.session.loggedIn = false;
  }
  next();
}
app.use(setSession);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if(config.web.minify == true) {
  var minify = require('express-minify');
  var compression = require('compression');
  app.use(compression());
  app.use(minify({
    js_match: /js/,
    css_match: /css/,
  }));
}
app.use(express.static(path.join(__dirname, 'public')));

//Use routers
app.use('/', indexRouter);
app.use('/cmd', cmdRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(config.server.dev == true) {
    console.log(err);
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {config: config});
});

module.exports = app;
