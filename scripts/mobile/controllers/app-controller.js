'use strict';

var _ = require('lodash');

module.exports = function ($scope, $rootScope) {
  ons.ready(function () {

    var pageId = 1;
    navi.pushPageWithHistory = function (pageUrl, options) {
      History.pageDict[pageId] = {
        pageUrl: pageUrl,
        options: options
      };
      History.pushState({ pageId: pageId }, null, '?' + pageUrl);
      pageId += 1;
    };

    navi.popPageWithHistory = function (options, times) {
      if (_.isUndefined(times)) {
        times = 1;
      }
      if (times <= 0) {
        return;
      }
      History.popOptions.push({ options: options, times: times });
      History.go(-times);
    };

    navi.clearAllPages = function () {
      var count = navi.getPages().length - 1;
      navi.popPageWithHistory({ animation: 'none' }, count);
    };

    navi.redirectToIndex = function (options) {
      if (_.isUndefined(options)) {
        options = {};
      }
      if (_.isUndefined(options.animation)) {
        options.animation = 'fade';
      }
      navi.clearAllPages();
      if (AV.User.current()) {
        navi.pushPageWithHistory('hole/list.html', options);
      } else {
        navi.pushPageWithHistory('user/login.html', options);
      }
    };

    History.replaceState({ pageId: 0 }, null, '?');
    History.pageDict = {};
    History.popOptions = [];
    History.Adapter.bind(window, 'statechange', function () {
      var index = -1;
      var i;
      var pages = navi.getPages();
      var historyPageId = History.getState().data.pageId;
      for (i = 0; i < pages.length; i ++) {
        if (i === 0 && historyPageId === 0) {
          index = i;
          break;
        }
        if (pages[i].options.pageId === historyPageId) {
          index = i;
          break;
        }
      }

      var pageUrl;
      var options;
      var times;
      if (index === -1) {
        if (History.pageDict[historyPageId]) {
          pageUrl = History.pageDict[historyPageId].pageUrl;
          options = History.pageDict[historyPageId].options;
          delete History.pageDict[historyPageId];
          options.pageId = historyPageId;
          navi.pushPage(pageUrl, options);
        } else {
          History.back();
        }
      } else {
        if (History.popOptions.length > 0) {
          options = History.popOptions[0].options;
          times = History.popOptions[0].times;
          if (index + times === pages.length - 1) {
            History.popOptions.shift();
            for (i = 0; i < times; i ++) {
              navi.popPage(options);
            }
          }
        } else {
          if (!$rootScope.goBackHandler) {
            for (i = index + 1; i < pages.length; i ++) {
              navi.popPage({ 'animation': 'none' });
            }
            if (index === 0) {
              window.location.href = '/mobile';
            }
          } else {
            $rootScope.goBackHandler();
            History.go(pages.length - 1 - index);
          }
        }
      }
    });

    $scope.getAvatarUrl = function (user, size) {
      if (!user.get('avatar')) {
        return '/assets/default-avatar.png';
      }
      if (size) {
        return user.get('avatar').thumbnailURL(size, size);
      } else {
        return user.get('avatar').url();
      }
    };

    if (AV.User.current()) {
      AV.User.current().fetch().then(function () {
        navi.redirectToIndex({ animation: 'none' });
      }, function (err) {
        if (err.message === 'Could not find user') {
          AV.User.logOut();
          navi.redirectToIndex();
        } else {
          console.error(err);
        }
      });
    } else {
      navi.redirectToIndex({ animation: 'none' });
    }
  });
};
