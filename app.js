const express = require('express');
const logger = require('morgan');

const passport = require('passport');
require('./configs/passport.config')(passport);

const usersRouter = require('./routes/users');
const geoRouter = require('./routes/geo');

const app = express();

app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/geo', geoRouter);

app.use((err, req, res, next) => {
  if (err) {
    if (err.error && err.error.isJoi) {
      res.status(400).json({ success: false, message: err.error.toString() });
    }
    if (err.name === 'MongoError') {
      res.status(400).json({ success: false, message: err.errmsg });
    }

    res.status(400).json({ success: false, message: err });
  }
  next(err);
});

module.exports = app;
