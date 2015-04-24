'use strict';

module.exports = function ($scope) {
  $scope.user = AV.User.current();

  $scope.changeAvatar = function () {
    navi.pushPageWithHistory('user/upload-avatar.html', { animation: 'fade' });
  };

  $scope.logout = function () {
    AV.User.logOut();
    navi.redirectToIndex();
  };
};
