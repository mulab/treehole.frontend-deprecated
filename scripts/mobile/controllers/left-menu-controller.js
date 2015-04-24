'use strict';

module.exports = function ($scope) {
  $scope.logout = function () {
    AV.User.logOut();
    navi.redirectToIndex();
  };
};
