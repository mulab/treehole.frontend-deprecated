'use strict';

var _ = require('lodash');
var helper = require('../../helper');

module.exports = function ($compile, resizeService) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var addButton = angular.element(element[0].querySelector('.add-image')).parent().parent();
      var container = angular.element(element[0].querySelector('.image-container'));
      var fileInput = angular.element(element[0].querySelector('.file-input'));
      var imageId = 0;

      function addImage(fileName, dataUrl) {
        var imageObj = new Image;
        imageObj.src = dataUrl;

        imageObj.onload = function () {
          var currentImageId = imageId;
          imageId += 1;
          scope.images.push({ id: currentImageId, name: fileName, dataUrl: dataUrl, width: imageObj.width, height: imageObj.height });
          var imageBox = angular.element('<div class="square-box"><div class="inner"><ons-gesture-detector class="image-box"><img></ons-gesture-detector></div></div>');
          imageBox.find('img').prop('src', dataUrl);
          $compile(imageBox)(scope);
          container[0].insertBefore(imageBox[0], addButton[0]);
          imageBox.find('div').on('hold', function () {
            ons.notification.confirm({
              title: '确认',
              message: '是否删除这张图片？',
              buttonLabels: ['确认', '取消'],
              callback: function (answer) {
                if (answer === 0) {
                  imageBox.remove();
                  _.remove(scope.images, function (elem) {
                    return elem.id === currentImageId;
                  });
                }
              }
            });
          });
          modal.hide();
        };
      }

      fileInput.on('change', function () {
        if (fileInput[0].files && fileInput[0].files[0]) {
          var modalContent = angular.element('<div id="modal-container"><ons-icon icon="ion-load-c" spin="true"></ons-icon><br><br>图片载入中，请稍等...</div>');
          $compile(modalContent)(scope);
          angular.element(document.getElementById('modal-container')).replaceWith(modalContent);
          modal.show();
          var file = fileInput[0].files[0];
          var reader = new FileReader();
          reader.onload = function () {
            var img = reader.result;
            if (file.size > 500 * 1024) {  // greater than 500KiB
              resizeService.resizeImage(img, { size: 500, height: 1080, sizeScale: 'ko' }, function (err, resizedImg) {
                if (err) {
                  modal.hide();
                  helper.showErrorAlert('图片读取失败！');
                } else {
                  addImage(file.name, resizedImg);
                }
              });
            } else {
              addImage(file.name, img);
            }
          };
          reader.onerror = function () {
            modal.hide();
            helper.showErrorAlert('图片读取失败！');
          };
          reader.readAsDataURL(file);
        }
        fileInput.val('');
      });
    }
  };
};
