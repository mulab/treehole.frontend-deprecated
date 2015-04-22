'use strict';

var Util = require('../util');

module.exports = function ($scope) {
  $scope.logout = function () {
    AV.User.logOut();
    Util.navigatorClear();
    navi.pushPage('login.html', { animation: 'fade' });
  };
};
