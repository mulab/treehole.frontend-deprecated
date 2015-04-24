'use strict';

var Hole = require('models/hole');
var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;
  $scope.images = [];

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingSubmit = false;
    });
  }

  $scope.submit = function () {
    var content = $scope.content;
    $scope.waitingSubmit = true;
    var errorMessages = [];
    if (_.isEmpty(content)) {
      errorMessages.push('树洞内容不能为空！');
    }
    if (!_.isEmpty(errorMessages)) {
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    Hole.createNewHole($scope.content, null, $scope.images).
      then(function () {
        navi.clearAllPages();
        navi.pushPageWithHistory('hole/list.html', { animation: 'fade' });
      }, function (err) {
        helper.showErrorAlert(helper.translate(err.message), onProcessingEnd);
      });
  };
};
