'use strict';

var _ = require('lodash');
var Hole = require('../../models/hole');

module.exports = function ($scope) {
  $scope.holes = [];
  var query = new AV.Query(Hole);
  query.descending('createdAt');
  query.include('author');
  query.find().then(function (holes) {
    $scope.holes = holes;
    $scope.$apply();
  });
};
