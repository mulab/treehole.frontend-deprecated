'use strict';

var _ = require('lodash');
var error = require('../util/error');

module.exports = function (app) {
  app.use('/user', require('./user'));
  app.use(function (req, res, next) {
    if (req.session.user) {
      next();
    } else {
      next(error('Login required', 400));
    }
  });

  app.use('/hole', require('./hole'));

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function (err, req, res, next) {
    if (!_.isNumber(err.status)) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.status(err.status).send({ message: err.message || '' });
    }
  });
};
