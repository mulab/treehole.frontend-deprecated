'use strict';

var req = require.context('.', true, /^\.\/.*\.js/);
var _ = require('lodash');
var S = require('string');
var URI = require('uri');

function getDirectiveName(path) {
  var fileName = URI(path).filename();
  return S(fileName).chompRight('.js').camelize().s;
}

module.exports = function (app) {
  _.each(req.keys(), function (entry) {
    if (entry !== './index.js') {
      var directive = req(entry);
      app.directive(getDirectiveName(entry), directive);
    }
  });
};
