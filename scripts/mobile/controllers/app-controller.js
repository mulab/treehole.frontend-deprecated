'use strict';

var _ = require('lodash');

module.exports = function ($scope, $rootScope) {
  ons.ready(function () {
    require('../history-api-support')(navi, History, window, '/mobile');
    navi.helper = {};

    navi.helper.clearAllPages = function () {
      var count = navi.getPages().length - 1;
      navi.popPageWithHistory({ animation: 'none' }, count);
    };

    navi.helper.redirectToIndex = function (options) {
      if (_.isUndefined(options)) {
        options = {};
      }
      if (_.isUndefined(options.animation)) {
        options.animation = 'fade';
      }
      navi.helper.clearAllPages();
      if (AV.User.current()) {
        navi.pushPageWithHistory('hole/list.html', options);
      } else {
        navi.pushPageWithHistory('user/login.html', options);
      }
    };

    $rootScope.helper = require('../view-helper');

    if (AV.User.current()) {
      AV.User.current().fetch().then(function () {
        navi.helper.redirectToIndex({ animation: 'none' });
      }, function (err) {
        if (err.message === 'Could not find user') {
          AV.User.logOut();
          navi.helper.redirectToIndex();
        } else {
          console.error(err);
        }
      });
    } else {
      navi.helper.redirectToIndex({ animation: 'none' });
    }
  });
};
