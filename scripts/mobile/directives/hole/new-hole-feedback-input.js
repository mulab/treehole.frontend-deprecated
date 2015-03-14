'use strict';

var _ = require('lodash');

module.exports = function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var oldValue = element.val();
      element.bind('input', function () {
        var newValue = element.val();
        if (newValue === oldValue) {
          return;
        }
        if (_.isEmpty(newValue)) {
          element.remove();
        } else if (_.isEmpty(oldValue)) {
          var newElement = element.clone();
          newElement.val('');
          element.parent().append(newElement);
          $compile(newElement)(scope);
        }
        oldValue = newValue;
      });
    }
  };
};
