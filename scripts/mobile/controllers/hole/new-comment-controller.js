'use strict';

var Comment = require('models/comment');
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
      $scope.currentCommentDialog.destroy();
      return helper.showErrorAlert(errorMessages[0]);
    }

    Comment.new({
      content: comment,
      replyTo: $scope.replyTo,
      hole: $scope.hole,
      author: AV.User.current()
    }).save().then(function () {
      $scope.currentCommentDialog.destroy();
      $scope.refresh();
    }, function (err) {
      $scope.currentCommentDialog.destroy();
      helper.showErrorAlert(helper.translate(err.message));
    });
  };
};
