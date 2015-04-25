'use strict';

var Hole = require('models/hole');
var _ = require('lodash');

module.exports = function ($scope, $timeout) {
  function refresh(callback) {
    var query = new AV.Query(Hole);
    query.descending('createdAt');
    query.include('author');
    query.include('images');
    query.find().then(function (holes) {
      $scope.holes = holes;
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  $scope.user = AV.User.current();
  $scope.hole = [];
  refresh(function () {
    $scope.$apply();
  });
  $scope.refresh = function ($done) {
    $timeout(function () {
      refresh($done);
    }, 1000);
  };
};
