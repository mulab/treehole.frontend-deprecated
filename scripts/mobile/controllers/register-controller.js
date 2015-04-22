'use strict';

var Util = require('../util');
var _ = require('lodash');

module.exports = function ($scope) {
  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingLogin = false;
      $scope.password = '';
      $scope.passwordConfirm = '';
    });
  }

  $scope.register = function () {
    var username = $scope.username;
    var password = $scope.password;
    var nickname = $scope.nickname;

    $scope.waitingLogin = true;
    var errorMessages = [];
    if (_.isEmpty(username)) {
      errorMessages.push('用户名不能为空！');
    } else {
      if (!(3 <= username.length && username.length <= 10)) {
        errorMessages.push('用户名长度必须在3到10之间！');
      }
      if (!username.match(/^[a-zA-Z0-9_\.]*$/)) {
        errorMessages.push('用户名包含非法字符！');
      }
    }
    if (_.isEmpty(nickname)) {
      errorMessages.push('昵称不能为空！');
    } else {
      if (!(3 <= nickname.length && nickname.length <= 15)) {
        errorMessages.push('昵称长度必须在3到15之间！');
      }
    }
    if (_.isEmpty(password)) {
      errorMessages.push('密码不能为空！');
    }
    if (password !== $scope.passwordConfirm) {
      errorMessages.push('两次输入的密码不一样！');
    }
    if (!_.isEmpty(errorMessages)) {
      return Util.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    AV.User.signUp(username, password, { nickname: nickname }).
      then(function () {
        Util.navigatorClear();
        navi.pushPage('hole/list.html', { animation: 'fade' });
      }, function (err) {
        Util.showErrorAlert(Util.translate(err.message), onProcessingEnd);
      });
  };
};
