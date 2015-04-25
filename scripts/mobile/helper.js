'use strict';

var _ = require('lodash');

exports.showErrorAlert = function (message, callback) {
  var options = {
    message: message,
    animation: 'none',
    title: '错误',
    buttonLabel: '确定'
  };
  if (_.isFunction(callback)) {
    options.callback = callback;
  }
  ons.notification.alert(options);
};

var TABLE = {
  'Username has already been taken': '用户名已被占用！',
  'Could not find user': '用户名或密码错误！',
  'The username and password mismatch.': '用户名或密码错误！',
  'Tsinghua authentication: username or password incorrect.': '清华账号或密码错误！',
  'Tsinghua authentication: connection error.': '暂时无法连接到服务器，请稍后重试！'
};

exports.translate = function (message) {
  if (message in TABLE) {
    message = TABLE[message];
  }
  return message;
};
