'use strict';

module.exports = function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var avatarInput = angular.element(element[0].querySelector('.avatar-input'));
      avatarInput.on('change', function () {
        var file = avatarInput[0].files[0];
        var reader = new FileReader();
        reader.onload = function() {
          scope.$apply(function () {
            scope.avatar = reader.result;
          });
        };
        scope.$apply(function () {
          scope.waitingLoading = true;
        });
        reader.readAsDataURL(file);
      });
    }
  };
};
