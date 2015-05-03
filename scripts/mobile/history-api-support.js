'use strict';

var _ = require('lodash');

module.exports = function (navi, History, window, indexUrl) {
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

  navi.setGoBackHandler = function (fn) {
    navi.goBackHandler = fn;
  };

  navi.removeGoBackHandler = function () {
    navi.goBackHandler = null;
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
        if (!_.isFunction(navi.goBackHandler)) {
          for (i = index + 1; i < pages.length; i ++) {
            navi.popPage({ 'animation': 'none' });
          }
          if (index === 0) {
            window.location.href = indexUrl;
          }
        } else {
          navi.goBackHandler();
          History.go(pages.length - 1 - index);
        }
      }
    }
  });
};
