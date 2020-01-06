var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const multer = require('multer');
const upload = multer({dest:'./public/uploads'});
const moment = require('moment');
const expressValidator = require('express-validator');

const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoriesRouter = require('./routes/categories');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set moment variable globally accessible
app.locals.moment = moment;
app.locals.truncate = function(text, length){
  return  text.substring(0, length)+' ... ';
}

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    let namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while(namespace.length){
      formParam += '['+ namespace.shift() +']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(require('connect-flash')());
app.use((req,res,next)=>{
  res.locals.messages = require('express-messages')(req,res);
  next();
})

// Make db accessible to router
app.use((req,res,next)=>{
  req.db = db;
  next();
});

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/categories',categoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title: 'Error '+err.status +' | Node Blog'});
});

module.exports = app;
