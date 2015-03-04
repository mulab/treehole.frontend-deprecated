'use strict';

var router = require('express').Router();
var co = require('co');
var _ = require('lodash');
var tsinghuaAuth = require('../util/tsinghua-auth');
var holeApi = require('../util/rest-request').use('treehole');
var error = require('../util/error');

router.get('/login', function (req, res, next) {
  return co(function* () {
    if (req.session.user) {
      return res.sendStatus(200);
    }
    var username = req.param('username');
    var password = req.param('password');
    if (_.isEmpty(username) || _.isEmpty(password)) {
      throw error('Invalid parameters.', 400);
    }
    var ticket = yield tsinghuaAuth.auth(username, password, req.ip);
    var userInfo = yield tsinghuaAuth.checkTicket(ticket, req.ip);
    var user = yield holeApi.get('users', userInfo.yhm);
    if (user) {
      req.session.user = user.user_id;
    } else {
      user = yield holeApi.post('users', {
        user_id: userInfo.yhm,
        screen_name: userInfo.xm,
        tsinghua_account: {
          student_number: userInfo.zjh,
          student_id: userInfo.yhm,
          real_name: userInfo.xm
        }
      });
      req.session.user = user.user_id;
    }
    res.sendStatus(200);
  }).catch(next);
});

module.exports = router;
