'use strict';

var Hole = require('models/hole');
var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope, $rootScope, $compile) {
  $scope.waitingSubmit = false;
  $scope.data = {};
  $scope.data.images = [];

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingSubmit = false;
    });
  }

  $scope.submit = function () {
    var content = $scope.data.content;
    $scope.waitingSubmit = true;
    var errorMessages = [];
    if (_.isEmpty(content)) {
      errorMessages.push('树洞内容不能为空！');
    }
    if (!_.isEmpty(errorMessages)) {
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    var modalVisible = false;

    Hole.createNewHole(content, $rootScope.currentChannel, $scope.data.images, $scope.data.anonymous, {
      onImageUploadStart: function (index) {
        var modalContent = angular.element('<div id="modal-container"><ons-icon icon="ion-load-c" spin="true"></ons-icon><br><br>正在上传第' + (index + 1) + '张图片，共' + ($scope.data.images.length) + '张</div>');
        $compile(modalContent)($scope);
        angular.element(document.getElementById('modal-container')).replaceWith(modalContent);
        if (!modalVisible) {
          modal.show();
          modalVisible = true;
        }
      },
      onPublishStart: function () {
        var modalContent = angular.element('<div id="modal-container"><ons-icon icon="ion-load-c" spin="true"></ons-icon><br><br>正在发布</div>');
        $compile(modalContent)($scope);
        angular.element(document.getElementById('modal-container')).replaceWith(modalContent);
        if (!modalVisible) {
          modal.show();
          modalVisible = true;
        }
      }
    }).then(function () {
      if (modalVisible) {
        modal.hide();
      }
      navi.getCurrentPage().options.callback();
      navi.popPageWithHistory({ animation: 'fade' });
    }, function (err) {
      if (modalVisible) {
        modal.hide();
      }
      helper.showErrorAlert(helper.translate(err.message), onProcessingEnd);
    });
  };
};
