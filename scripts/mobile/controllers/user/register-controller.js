'use strict';

var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;
  $scope.data = {};

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.data.waitingSubmit = false;
      $scope.data.password = '';
      $scope.data.passwordConfirm = '';
    });
  }

  $scope.register = function () {
    var username = $scope.data.username;
    var password = $scope.data.password;
    var nickname = $scope.data.nickname;

    $scope.waitingSubmit = true;
    var errorMessages = [];
    if (_.isEmpty(username)) {
      errorMessages.push('用户名不能为空！');
    } else {
      if (!(3 <= username.length && username.length <= 10)) {
        errorMessages.push('用户名长度必须在3到10之间！');
      }
      if (!username.match(/^[a-zA-Z0-9_\.]*$/)) {
        errorMessages.push('用户名只能包含英文字母、数字、圆点(.)和下划线！');
      }
    }
    if (_.isEmpty(nickname)) {
      errorMessages.push('昵称不能为空！');
    } else {
      if (!(1 <= nickname.length && nickname.length <= 15)) {
        errorMessages.push('昵称长度必须在1到15之间！');
      }
    }
    if (_.isEmpty(password)) {
      errorMessages.push('密码不能为空！');
    }
    if (password !== $scope.data.passwordConfirm) {
      errorMessages.push('两次输入的密码不一样！');
    }
    if (!_.isEmpty(errorMessages)) {
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    AV.User.signUp(username, password, { nickname: nickname }).
      then(function () {
        navi.helper.clearAllPages();
        navi.pushPageWithHistory('user/upload-avatar.html', { animation: 'fade', afterRegister: true });
      }, function (err) {
        helper.showErrorAlert(helper.translate(err.message), onProcessingEnd);
      });
  };
};
