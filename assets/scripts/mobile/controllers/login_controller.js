'use strict';

module.exports = function ($scope, $http) {
  $scope.waitingLogin = false;
  $scope.login = function () {
    $scope.waitingLogin = true;
    $http({
      method: 'GET',
      url: '/user/login',
      params: {
        username: $scope.username,
        password: $scope.password
      }
    }).success(function (data, status, headers, config) {
      navi.resetToPage('home.html', { animation: 'fade' });
    }).error(function (data, status, headers, config) {
      $scope.waitingLogin = false;
      $scope.password = '';
      ons.notification.alert({
        message: data.message,
        animation: 'none',
        buttonLabel: '确定'
      });
    });
  };
};
