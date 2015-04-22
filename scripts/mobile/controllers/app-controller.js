'use strict';

module.exports = function () {
  ons.ready(function () {
    if (AV.User.current()) {
      navi.pushPage('hole/list.html', { animation: 'none' });
    } else {
      navi.pushPage('login.html', { animation: 'none' });
    }
  });
};
