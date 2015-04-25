'use strict';

var Hole = require('models/hole');

module.exports = function ($scope) {
  var hole = navi.getCurrentPage().options.hole;
  $scope.hole = hole;
  $scope.user = AV.User.current();

  function refreshComments() {
    hole.fetchComments().then(function (comments) {
      $scope.$apply(function () {
        $scope.comments = comments;
      });
    });
  }
  refreshComments();
  $scope.refreshComments = refreshComments;

  $scope.showCommentDialog = function () {
    ons.createDialog('hole/comment-dialog.html', {
      parentScope: $scope
    }).then(function (dialog) {
      $scope.commentDialog = dialog;
      dialog.show();
    });
  };
};
