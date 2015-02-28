'use strict';

var _ = require('lodash');

/**
 *
 * @param {String} message Message of the error
 * @param {Number|Object} info Status code or additional information
 * @returns {Error}
 */
module.exports = function (message, info) {
  var err = new Error(message);
  if (_.isPlainObject(info)) {
    _.assign(err, info);
  }
  if (_.isNumber(info)) {
    err.status = info;
  }
  return err;
};
