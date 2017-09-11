var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var app = express();
var routes = require('./routes');
var api = require('./routes/api.js');

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge:3600000},
  secret: 'datalist'
}));

app.get('/', routes.index);
app.get('/details/:choice', routes.details);

// JSON API

app.get('/api/posts', api.posts);
app.get('/api/post/:post_num', api.post);

app.put('/api/signIn', api.signIn);
app.post('/api/signUp', api.signUp);
app.put('/api/signOut', api.signOut);
app.post('/api/checkUserRepeat', api.checkUserRepeat);

app.post('/api/addpost', api.addPost);
app.put('/api/editpost/:post_num', api.editPost);
app.delete('/api/deletepost/:post_num', api.deletePost);
app.put('/api/post/:post_num/ShowOrHidePost', api.ShowOrHidePost);

app.post('/api/post/:post_num/addComment', api.addComment);
app.put('/api/post/:post_num/editComment/:comment_num', api.editComment);
app.delete('/api/post/:post_num/deleteComment/:comment_num', api.deleteComment);
app.put('/api/post/:post_num/ShowOrHideComment/:comment_num', api.ShowOrHideComment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


