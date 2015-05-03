'use strict';

var _ = require('lodash');

var push = AV.push({ appId: CONFIG.appId, appKey: CONFIG.appKey });
push.open();

var receivers = {};
push.on('message', function (data) {
  var channel = data._channel;
  delete data._channel;
  if (receivers[channel]) {
    _.each(receivers[channel], function (receiver) {
      receiver.fn(data);
    });
  }
});

var token = 0;

exports.subscribe = function (channel, receiver) {
  if (!receivers[channel]) {
    push.subscribe(channel);
    receivers[channel] = [];
  }
  receivers[channel].push({ fn: receiver, token: token });
  token += 1;
};

exports.unsubscribe = function (token) {
  _.each(receivers, function (list) {
    _.remove(list, function (entry) {
      return entry.token === token;
    });
  });
};
