'use strict';

var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;
  $scope.user = AV.User.current();

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingSubmit = false;
      $scope.oldPassword = '';
      $scope.password = '';
      $scope.passwordConfirm = '';
    });
  }

  var changeNicknameDialog;
  $scope.showChangeNicknameDialog = function () {
    $scope.newNickname = AV.User.current().get('nickname');
    if (changeNicknameDialog) {
      changeNicknameDialog.show();
    } else {
      ons.createDialog('user/change-nickname.html', {
        parentScope: $scope
      }).then(function (dialog) {
        changeNicknameDialog = dialog;
        $scope.changeNicknameDialog = dialog;
        dialog.show();
      });
    }
  };

  var changePasswordDialog;
  $scope.showChangePasswordDialog = function () {
    $scope.oldPassword = '';
    $scope.password = '';
    $scope.passwordConfirm = '';
    if (changePasswordDialog) {
      changePasswordDialog.show();
    } else {
      ons.createDialog('user/change-password.html', {
        parentScope: $scope
      }).then(function (dialog) {
        changePasswordDialog = dialog;
        $scope.changePasswordDialog = dialog;
        dialog.show();
      });
    }
  };

  function showErrorAlert(dialog, message) {
    dialog.hide({ animation: 'none' });
    helper.showErrorAlert(message, function () {
      onProcessingEnd();
      dialog.show({ animation: 'none' });
    });
  }

  $scope.changeNickname = function () {
    var user = AV.User.current();
    var nickname = $scope.newNickname;

    $scope.waitingSubmit = true;
    var errorMessages = [];

    if (_.isEmpty(nickname)) {
      errorMessages.push('昵称不能为空！');
    } else {
      if (!(1 <= nickname.length && nickname.length <= 15)) {
        errorMessages.push('昵称长度必须在1到15之间！');
      }
    }
    if (!_.isEmpty(errorMessages)) {
      return showErrorAlert(changeNicknameDialog, errorMessages[0]);
    }

    user.set('nickname', nickname);
    user.save().then(function () {
      changeNicknameDialog.hide({ animation: 'none' });
      helper.showErrorAlert('修改成功！', onProcessingEnd);
    }, function (err) {
      showErrorAlert(changeNicknameDialog, helper.translate(err.message));
    });
  };

  $scope.changePassword = function () {
    var password = $scope.password;
    var oldPassword = $scope.oldPassword;

    $scope.waitingSubmit = true;
    var errorMessages = [];
    if (_.isEmpty(oldPassword)) {
      errorMessages.push('旧密码不能为空！');
    }
    if (_.isEmpty(password)) {
      errorMessages.push('新密码不能为空！');
    }
    if (password !== $scope.passwordConfirm) {
      errorMessages.push('两次输入的新密码不一样！');
    }
    if (!_.isEmpty(errorMessages)) {
      return showErrorAlert(changePasswordDialog, errorMessages[0]);
    }

    var user = AV.User.current();
    user.updatePassword(oldPassword, password).then(function () {
      changePasswordDialog.hide({ animation: 'none' });
      helper.showErrorAlert('修改成功！', onProcessingEnd);
    }, function (err) {
      showErrorAlert(changePasswordDialog, helper.translate(err.message));
    });
  };
};
