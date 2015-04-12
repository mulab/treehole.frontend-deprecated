'use strict';

var Hole = require('models/hole');

module.exports = function ($scope) {
  $scope.hole = [];
  var query = new AV.Query(Hole);
  query.descending('createdAt');
  query.include('author');
  query.include('images');
  query.find().then(function (holes) {
    $scope.holes = holes;
    $scope.$apply();
  });
};
