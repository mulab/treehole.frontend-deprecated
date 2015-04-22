'use strict';

module.exports = function () {
  ons.ready(function () {
    if (AV.User.current()) {
      navi.pushPage('hole/list.html', { animation: 'fade' });
    } else {
      navi.pushPage('login.html', { animation: 'fade' });
    }
  });
};
