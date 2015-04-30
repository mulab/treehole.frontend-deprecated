'use strict';

var helper = require('../../helper');
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
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    $scope.hole.createComment($scope.commentContent, $scope.replyTo).
      then(function () {
        $scope.currentCommentDialog.destroy();
        $scope.refresh();
      }, function (err) {
        $scope.currentCommentDialog.destroy();
        helper.showErrorAlert(helper.translate(err.message), onProcessingEnd);
      });
  };
};
