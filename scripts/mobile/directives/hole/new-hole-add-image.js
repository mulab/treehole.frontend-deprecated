'use strict';

var _ = require('lodash');

module.exports = function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var addButton = angular.element(element[0].querySelector('.add-image'));
      var container = addButton.parent();
      var fileInput = angular.element(element[0].querySelector('.file-input'));
      fileInput.on('change', function () {
        if (fileInput[0].files && fileInput[0].files[0]) {
          var file = fileInput[0].files[0];
          scope.images.push(file);
          var reader = new FileReader();
          reader.onload = function() {
            var imageBox = angular.element('<ons-gesture-detector><div class="image-box"><img></div><ons-gesture-detector>');
            imageBox.find('img').prop('src', reader.result);
            $compile(imageBox)(scope);
            container[0].insertBefore(imageBox[0], addButton[0]);
            var removeImage = function () {
              imageBox.remove();
              _.pull(scope.images, file);
            };
            imageBox.find('div').on('dragleft', removeImage);
          };
          reader.readAsDataURL(file);
        }
        fileInput.val('');
      });
    }
  };
};
