'use strict';

var Hole = require('models/hole');
var _ = require('lodash');

module.exports = function ($scope, $timeout) {
  function refresh(callback) {
    var query = new AV.Query(Hole);
    query.descending('createdAt');
    query.include('author');
    query.include('author.avatar');
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
  $scope.ready = false;
  refresh(function () {
    $scope.$apply(function () {
      $scope.ready = true;
    });
  });
  $scope.refresh = function ($done) {
    $timeout(function () {
      refresh($done);
    }, 1000);
  };
};
