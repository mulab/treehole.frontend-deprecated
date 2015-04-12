'use strict';

var Hole = require('models/hole');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;
  $scope.images = [];
  $scope.submit = function () {
    $scope.waitingSubmit = true;
    Hole.createNewHole($scope.content, null, $scope.images).
      then(function () {
        navi.resetToPage('hole/list.html', { animation: 'fade' });
      }, function (err) {
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
