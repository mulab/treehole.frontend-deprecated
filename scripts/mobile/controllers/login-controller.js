'use strict';

var statusCode = require('../util/status-code');

module.exports = function ($scope, $http) {
  $scope.waitingLogin = false;
  $scope.login = function () {
    $scope.waitingLogin = true;
    AV.User.logIn($scope.username, $scope.password).
      then(function () {
        navi.resetToPage('hole/list.html', { animation: 'fade' });
      }, function (err) {
        ons.notification.alert({
          message: err.message,
          animation: 'none',
          buttonLabel: '确定'
        });
        $scope.waitingLogin = false;
        $scope.password = '';
        $scope.$apply();
      });
  };
};
