'use strict';

module.exports = function ($interval) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      $interval(function () {
        var html = element.html();
        if (html.length === 3) {
          html = '';
        } else {
          html += '.';
        }
        element.html(html);
      }, 300);
    }
  };
};
