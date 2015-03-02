'use strict';

var md5 = require("crypto-js/md5");
var _ = require('lodash');
var error = require('./error');

function encodeBase64(string) {
  return new Buffer(string).toString("base64");
}

function getExpireTime(minuteDelta) {
  var d = new Date();
  return Math.floor(d.getTime() / 1000 + minuteDelta * 60);
}

function getSavePath(imageId) {
  return '/' + imageId + '.jpg';
}

exports.use = function (configName) {
  var config = require('config').get('upyun' + '.' + configName);

  return {
    getRequestUrl: function () {
      return config.get('request_base_url') + '/' + config.get('bucket');
    },
    validateSign: function (body, sign) {
      return sign === md5(body + '&' + config.get('api_secret'));
    },
    generateRequest: function (imageId) {
      var params = _.cloneDeep(config.get('upload_options'));
      params['bucket'] = config.get('bucket');
      params['save-key'] = getSavePath(imageId);
      params['expiration'] = getExpireTime(config.get('valid_minutes'));
      var policy = encodeBase64(JSON.stringify(params));
      var signature = md5(policy + '&' + config.get('api_secret'));
      return { policy: policy, signature: signature };
    },
    getShowUrl: function (imageId) {
      return config.get('show_url') + getSavePath(imageId);
    }
  };
};
