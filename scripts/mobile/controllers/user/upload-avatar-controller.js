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

  $scope.upload = function () {
    $scope.waitingSubmit = true;
    var avatar = new AV.File('avatar.png', { base64: $scope.croppedAvatar.replace(/^data:image\/png;base64,/, '') });
    AV.User.current().save({ avatar: avatar }).then(function () {
      if ($scope.afterRegister) {
        $scope.waitingSubmit = false;
        $scope.nextStep();
      } else {
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
    navi.redirectToIndex({ animation: 'fade' });
  };
};
