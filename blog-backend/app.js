var express = require('express');
var path = require('path');
var url = require('url');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var tools = require('./lib/tools');
var config = require('./config');
var registerLoginRouter = require('./routes/registerLoginRouter');
var userPostRouter = require('./routes/userPostRouter');
var managerPostRouter = require('./routes/managerPostRouter');
var indexRouter = require('./routes/indexRouter');



var app = express();

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(function(req, res, next) {
  if (req.url.indexOf('proxy/') !== -1) {
    req.url = req.url.slice('proxy/'.length);
  }
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use(session({
  rolling:true,
  secret: 'blog_app',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1800000 },
  store: new MongoStore({
    url: config.url_sessions,
    ttl: 1800 // = 10 minutes. Default
  }),
}));

// app.use('/', indexRouter);
app.use('/api', registerLoginRouter);
app.use('/Mapi', managerPostRouter);
app.use('/api', userPostRouter);
// app.get('*', indexRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
