'use strict';

var _ = require('lodash');

exports.showAlert = function (message, callback) {
  var options = {
    message: message,
    animation: 'none',
    title: '消息',
    buttonLabel: '确定'
  };
  if (_.isFunction(callback)) {
    options.callback = callback;
  }
  ons.notification.alert(options);
};

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
  'Could not find user': '用户名不存在！',
  'The username and password mismatch.': '密码错误！',
  'Tsinghua authentication: username or password incorrect.': '清华账号或密码错误！',
  'Tsinghua authentication: connection error.': '暂时无法连接到服务器，请稍后重试！',
  'Tsinghua authentication: provided account exceeds authentication quota.': '该账号已到达认证次数上限！'
};

exports.translate = function (message) {
  if (message in TABLE) {
    message = TABLE[message];
  }
  return message;
};

exports.generateAnonymousNickname = function (index) {
  var tianGan = '甲乙丙丁戊己庚辛壬癸';
  if (index < 10) {
    return '路人' + tianGan[index];
  } else {
    return '路人' + (index + 1);
  }
};
