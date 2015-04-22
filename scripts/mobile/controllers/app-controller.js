'use strict';

module.exports = function () {
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
      if (!times) {
        times = 1;
      }
      History.popOptions.push({ options: options, times: times });
      History.go(-times);
    };

    navi.clearAllPages = function () {
      var count = navi.getPages().length - 1;
      navi.popPageWithHistory({ animation: 'none' }, count);
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
        pageUrl = History.pageDict[historyPageId].pageUrl;
        options = History.pageDict[historyPageId].options;
        options.pageId = historyPageId;
        navi.pushPage(pageUrl, options);
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
          for (i = index + 1; i < pages.length; i ++) {
            navi.popPage({ 'animation': 'slide' });
          }
        }
      }
    });

    if (AV.User.current()) {
      navi.pushPageWithHistory('hole/list.html', { animation: 'none' });
    } else {
      navi.pushPageWithHistory('login.html', { animation: 'none' });
    }
  });
};
