var createError = require('http-errors');
var express = require('express');
// let expressJWT = require('express-jwt');
let bodyParser = require('body-parser')
let cors = require('cors')
let Config = require('./config')

var app = express();
app.use(cors())
app.use(bodyParser.json({limit:"1MB"}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err)
  res.send({result:-1, message:"error"})
});

module.exports = app;
