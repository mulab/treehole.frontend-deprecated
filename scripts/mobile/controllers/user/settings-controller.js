'use strict';

var helper = require('../../helper');
var _ = require('lodash');

module.exports = function ($scope) {
  $scope.waitingSubmit = false;
  $scope.dialogs = {};
   
  $scope.show = function(dlg) {
    if (!$scope.dialogs[dlg]) {
      ons.createDialog(dlg).then(function(dialog) {
        $scope.dialogs[dlg] = dialog;
        dialog.show();
      });
    }
    else {
      $scope.dialogs[dlg].show();
    }
  };

  function onProcessingEnd() {
    $scope.$apply(function () {
      $scope.waitingSubmit = false;
      $scope.oldPassword = '';
      $scope.password = '';
      $scope.passwordConfirm = '';
      $scope.nickname = '';
    });
  };

  $scope.passwordChange = function () {
    var password = $scope.password;
    var oldPassword = $scope.oldPassword;

    $scope.waitingSubmit = true;
    var errorMessages = [];
    if (_.isEmpty(oldPassword)) {
      errorMessages.push('密码不能为空！');
    }
    if (_.isEmpty(password)) {
      errorMessages.push('密码不能为空！');
    }
    if (password !== $scope.passwordConfirm) {
      errorMessages.push('两次输入的密码不一样！');
    }
    if (!_.isEmpty(errorMessages)) {
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    }

    var user = AV.User.current();
    user.updatePassword(oldPassword, password).then(function(){
      navi.popPageWithHistory({ animation: 'none' }, navi.getPages().length - 1);
      navi.pushPageWithHistory('hole/list.html', { animation: 'fade' });
      //更新成功
      },function(err){
        //更新失败
        console.dir(err);
      });
  };

  $scope.nicknameChange = function () {
    var nickname = $scope.nickname;

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
      return helper.showErrorAlert(errorMessages[0], onProcessingEnd);
    };

    var user = AV.User.current();
    user.set("nickname", nickname);
    //navi.pushPageWithHistory('hole/list.html', { animation: 'fade' });
    user.save().then(function(){
        $scope.dialogs[dlg].hide();
        navi.popPageWithHistory({ animation: 'none' }, navi.getPages().length - 1);
        navi.pushPageWithHistory('hole/list.html', { animation: 'fade' });
        //更新成功
      },function(err){
       //更新失败
       console.dir(err);
      });
  };
};
