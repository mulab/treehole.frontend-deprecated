'use strict';

var req = require.context('.', true, /^\.\/.*\.js/);
var _ = require('lodash');
var S = require('string');
var URI = require('uri');

function getFilterName(path) {
  var fileName = URI(path).filename();
  return S(fileName).chompRight('.js').camelize().s;
}

module.exports = function (app) {
  _.each(req.keys(), function (entry) {
    if (entry !== './index.js') {
      var filter = req(entry);
      app.filter(getFilterName(entry), function () {
        return filter;
      });
    }
  });
};
