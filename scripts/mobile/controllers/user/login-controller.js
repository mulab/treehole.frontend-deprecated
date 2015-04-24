'use strict';

var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope) {
  $scope.waitingLogin = false;

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingLogin = false;
      $scope.password = '';
    });
  }

  $scope.login = function () {
    var username = $scope.username;
    var password = $scope.password;
    $scope.waitingLogin = true;
    var errorMessages = [];
    if (_.isEmpty(username)) {
      errorMessages.push('用户名不能为空！');
    }
    if (_.isEmpty(password)) {
      errorMessages.push('密码不能为空！');
    }
    if (!_.isEmpty(errorMessages)) {
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    AV.User.logIn(username, password).
      then(function () {
        navi.redirectToIndex();
      }, function (err) {
        helper.showErrorAlert(helper.translate(err.message), onProcessingEnd);
      });
  };
};
