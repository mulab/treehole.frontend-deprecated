'use strict';

module.exports = function ($scope, $http) {
  $scope.holes = [];
  $http.get('/hole').success(function (data) {
    $scope.holes = data;
  });
};
