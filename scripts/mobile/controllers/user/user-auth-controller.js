'use strict';

var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;

  $scope.afterRegister = navi.getCurrentPage().options.afterRegister;

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingSubmit = false;
    });
  }

  $scope.submit = function () {
    var username = $scope.username;
    var password = $scope.password;

    $scope.waitingSubmit = true;
    var errorMessages = [];
    if (_.isEmpty(username)) {
      errorMessages.push('清华账号不能为空！');
    }
    if (_.isEmpty(password)) {
      errorMessages.push('密码不能为空！');
    }
    if (!_.isEmpty(errorMessages)) {
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    AV.Cloud.run('tsinghuaAccountAuth', { username: username, password: password })
      .then(function () {
        return AV.User.current().fetch();
      }).then(function () {
        ons.notification.alert({
          message: '认证成功！',
          animation: 'none',
          title: '提示',
          buttonLabel: '确定',
          callback: function () {
            if ($scope.afterRegister) {
              $scope.waitingSubmit = false;
              $scope.nextStep();
            } else {
              $scope.$apply();
              navi.popPageWithHistory();
            }
          }
        });
      }).catch(function (err) {
        helper.showErrorAlert(helper.translate(err.message), onProcessingEnd);
      });
  };

  $scope.nextStep = function () {
    if ($scope.waitingSubmit) {
      return;
    }
    navi.redirectToIndex({ animation: 'fade' });
  };
};
