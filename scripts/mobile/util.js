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

exports.navigatorClear = function () {
  var count = navi.getPages().length - 1;
  var i;
  for (i = 0; i < count; i ++) {
    navi.popPage();
  }
};

var TABLE = {
  'Username has already been taken': '用户名已被占用！',
  'Could not find user': '用户名或密码错误！',
  'The username and password mismatch.': '用户名或密码错误！'
};

exports.translate = function (message) {
  if (message in TABLE) {
    message = TABLE[message];
  }
  return message;
};
