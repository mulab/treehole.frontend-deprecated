'use strict';

var base64Mime = require('base64mime');

module.exports = function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var avatarInput = angular.element(element[0].querySelector('.avatar-input'));
      avatarInput.on('change', function () {
        var file = avatarInput[0].files[0];
        var reader = new FileReader();
        reader.onload = function() {
          var img = reader.result;
          if (!base64Mime(img).startsWith('image')) {
            scope.errorLoading();
            return;
          }
          scope.$apply(function () {
            scope.avatar = img;
          });
        };
        reader.onerror = function () {
          scope.errorLoading();
        };
        scope.$apply(function () {
          scope.waitingLoading = true;
        });
        reader.readAsDataURL(file);
      });
    }
  };
};
