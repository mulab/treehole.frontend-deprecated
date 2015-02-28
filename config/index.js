'use strict';

var config = require('config');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

module.exports = function (app, callback) {
  app.use(express.static('public'));
  app.use(logger(config.get('debug') ? 'dev': 'combined'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(expressSession({
    secret: 'mULab3.14159',
    resave: false,
    saveUninitialized: true
  }));
};
