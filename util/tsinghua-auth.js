'use strict';

var tsinghuaAuthApi = require('./rest-request').use('tsinghua-auth');
var appid = require('config').get('tsinghua-auth.appid');
var error = require('./error');

function convertUserIp(userIp) {
  return userIp.replace(/./g, '_');
}

function auth(username, password, userIp) {
  return tsinghuaAuthApi.post('login', appid, convertUserIp(userIp), {
    username: username,
    password: password
  }).then(function (data) {
    if (data.status === 'RESTLOGIN_OK') {
      return data.ticket;
    } else {
      throw error('Authentication failed', 403);
    }
  });
}

function checkTicket(ticket, userIp) {
  return tsinghuaAuthApi.get('checkticket', appid, ticket, convertUserIp(userIp),
    function (data) {
      var result = {};
      var parts = data.split(':');
      for (var i = 0; i < parts.length; i++) {
        var tmp = parts[i].split('=');
        result[tmp[0]] = tmp[1];
      }
      return result;
    })
    .then(function (data) {
      if (data.code === '0') {
        return data;
      } else {
        throw error('Authentication failed', 403);
      }
    });
}

exports.auth = auth;
exports.checkTicket = checkTicket;
