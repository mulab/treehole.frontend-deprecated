'use strict';

var request = require('request');
var _ = require('lodash');
var error = require('./error');
var Promise = require('bluebird');

exports.use = function (configName) {
  var config = require('config').get('rest_request' + '.' + configName);

  function fullUrl(paths) {
    var full = config['base_url'];
    _.each(paths, function (path) {
      full += '/' + path.toString();
    });
    return full;
  }

  function extractParams(args) {
    args = _.toArray(args);
    var params = {};
    if (_.isPlainObject(_.last(args))) {
      params = _.last(args);
      args.pop();
    }
    return { paths: args, params: params };
  }

  function errorHandler(resolve, reject) {
    return function (err, res, data) {
      if (err) {
        return reject(err);
      }
      try {
        data = JSON.parse(data);
      } catch (err) {
      }
      if (res.statusCode >= 400) {
        return reject(error(data.message, res.statusCode));
      }
      resolve(data);
    };
  }

  return {
    get: function () {
      var result = extractParams(arguments);
      return new Promise(function (resolve, reject) {
        request.get({ url: fullUrl(result.paths), qs: result.params }, errorHandler(resolve, reject));
      });
    },
    post: function () {
      var result = extractParams(arguments);
      return new Promise(function (resolve, reject) {
        request.post({ url: fullUrl(result.paths), form: result.params }, errorHandler(resolve, reject));
      });
    }
  };
};
