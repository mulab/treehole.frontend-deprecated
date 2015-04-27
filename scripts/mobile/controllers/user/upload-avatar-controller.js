'use strict';

var helper = require('../../helper');

module.exports = function ($scope) {
  $scope.waitingLoading = false;
  $scope.waitingSubmit = false;

  $scope.afterRegister = navi.getCurrentPage().options.afterRegister;
  $scope.avatar = '';
  $scope.croppedAvatar = '';

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingSubmit = false;
    });
  }

  $scope.errorLoading = function () {
    helper.showErrorAlert('载入失败！', function () {
      $scope.$apply(function () {
        $scope.avatar = '';
        $scope.waitingLoading = false;
      });
    });
  };

  $scope.upload = function () {
    $scope.waitingSubmit = true;
    var acl = new AV.ACL();
    acl.setPublicReadAccess(true);
    acl.setWriteAccess(AV.User.current(), true);
    var avatar = new AV.File('avatar.png', { base64: $scope.croppedAvatar.replace(/^data:image\/png;base64,/, '') });
    avatar.setACL(acl);
    var originalAvatar = AV.User.current().get('avatar');
    AV.User.current().save({ avatar: avatar }).then(function () {
      if (originalAvatar) {
        originalAvatar.destroy();
      }
      if ($scope.afterRegister) {
        $scope.waitingSubmit = false;
        $scope.nextStep();
      } else {
        $scope.$apply();
        navi.popPageWithHistory();
      }
    }, function (err) {
      helper.showErrorAlert(helper.translate(err.message), onProcessingEnd);
    });
  };

  $scope.nextStep = function () {
    if ($scope.waitingLoading || $scope.waitingSubmit) {
      return;
    }
    navi.clearAllPages();
    navi.pushPageWithHistory('user/auth.html', { animation: 'fade', afterRegister: true });
  };
};
