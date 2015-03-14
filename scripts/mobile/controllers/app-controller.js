'use strict';

module.exports = function ($scope) {
  ons.ready(function () {
    if (AV.User.current()) {
      navi.resetToPage('hole/list.html', { animation: 'fade' });
    } else {
      navi.resetToPage('login.html', {animation: 'none'});
    }
  });
};
