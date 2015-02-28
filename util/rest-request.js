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
      args = args.pop();
    }
    return { paths: args, params: params };
  }

  function doRequest(method, url, params) {
    return new Promise(function (resolve, reject) {
      request({
        method: method,
        uri: url,
        data: params,
        json: true
      }, function (err, res, data) {
        if (err) {
          return reject(err);
        }
        if (res.statusCode >= 400) {
          return reject(error(data.message, res.statusCode));
        }
        resolve(data);
      });
    });
  }

  return {
    get: function () {
      var result = extractParams(arguments);
      return doRequest('GET', fullUrl(result.paths), result.params);
    },
    post: function () {
      var result = extractParams(arguments);
      return doRequest('POST', fullUrl(result.paths), result.params);
    }
  };
};
