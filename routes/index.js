'use strict';

var _ = require('lodash');

module.exports = function (app) {
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
