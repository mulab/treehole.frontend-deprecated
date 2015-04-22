'use strict';

var Util = require('../../util');
var _ = require('lodash');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingSubmit = false;
    });
  }

  $scope.submitComment = function () {
    var comment = $scope.commentContent;
    $scope.waitingSubmit = true;
    var errorMessages = [];
    if (_.isEmpty(comment)) {
      errorMessages.push('评论不能为空！');
   }

    if (!_.isEmpty(errorMessages)) {
      $scope.commentDialog.destroy();
      return Util.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    $scope.hole.createComment($scope.commentContent).
      then(function () {
        $scope.commentDialog.destroy();
        $scope.refreshComments();
      }, function (err) {
        $scope.commentDialog.destroy();
        Util.showErrorAlert(Util.translate(err.message), onProcessingEnd);
      });
  };
};
