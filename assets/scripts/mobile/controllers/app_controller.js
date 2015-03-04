'use strict';

module.exports = function ($scope, $http) {
  ons.ready(function () {
    $http({
      method: 'GET',
      url: '/user/login'
    }).success(function (data, status, headers, config) {
      navi.resetToPage('home.html', {animation: 'none'});
    }).error(function (data, status, headers, config) {
      navi.resetToPage('login.html', {animation: 'none'});
    });
  });
};
