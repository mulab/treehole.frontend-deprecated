'use strict';

var _ = require('lodash');

module.exports = function ($scope, $rootScope, $compile) {
  ons.ready(function () {
    function checkWechat() {
      var ua = navigator.userAgent;
      if (ua.indexOf('MicroMessenger') !== -1) {
        var modalContent = angular.element('<div id="modal-container"><div class="wechat"><img class="imgArrow" src="/resources/arrow.png" alt="箭头" /><div class="tipDiv1">为了您更好的体验，<br>请在浏览器中打开页面。</div><div class="tipDiv2">Step：<br>1、点击右上角按钮；<br>2、选择在浏览器中打开。<br></div><img class="imgMiao" src="/resources/LabmU.png" alt="喵"></div></div>');
        $compile(modalContent)($scope);
        angular.element(document.getElementById('modal-container')).replaceWith(modalContent);
        modal.show();
        return true;
      } else {
        return false;
      }
    }

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

    if (checkWechat()) {
      return;
    }

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
      navi.pushPageWithHistory('welcome.html', { animation: 'none' });
    }
  });
};
