'use strict';

var req = require.context('.', true, /^\.\/.*-controller\.js/);
var _ = require('lodash');
var S = require('string');
var URI = require('uri');

function getControllerName(path) {
  var fileName = URI(path).filename();
  return S('_' + fileName.replace('-', '_')).chompRight('.js').camelize().s;
}

module.exports = function (app) {
  _.each(req.keys(), function (entry) {
    app.controller(getControllerName(entry), req(entry));
  });
};
