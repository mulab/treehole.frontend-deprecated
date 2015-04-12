'use strict';

module.exports = function ($scope) {
  $scope.waitingSubmit = false;
  $scope.submitComment = function () {
    $scope.waitingSubmit = true;
    $scope.hole.createComment($scope.commentContent).
      then(function () {
        $scope.commentDialog.destroy();
        $scope.refreshComments();
      }, function (err) {
        $scope.commentDialog.destroy();
        ons.notification.alert({
          message: err.message,
          animation: 'none',
          buttonLabel: '确定',
          callback: function () {
            $scope.$apply(function () {
              $scope.waitingSubmit = false;
            });
          }
        });
      });
  };
};
