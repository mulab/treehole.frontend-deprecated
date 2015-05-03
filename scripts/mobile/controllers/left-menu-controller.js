'use strict';

module.exports = function ($scope) {
  $scope.user = AV.User.current();

  $scope.logout = function () {
    AV.User.logOut();
    navi.helper.redirectToIndex();
  };
};
