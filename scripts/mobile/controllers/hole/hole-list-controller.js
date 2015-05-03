'use strict';

var Hole = require('models/hole');
var Channel = require('models/channel');
var Notification = require('models/Notification');
var _ = require('lodash');

module.exports = function ($scope, $rootScope, $timeout) {
  function retrieveChannels(callback) {
    var query = new AV.Query(Channel);
    query.ascending('index');
    query.find().then(function (channels) {
      $scope.$apply(function () {
        $rootScope.channels = channels;
        $rootScope.currentChannel = _.find(channels, function (channel) {
          return channel.get('isDefault');
        });
      });
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  function retrieveHoles(callback) {
    var query = new AV.Query(Hole);
    query.descending('createdAt');
    query.include('author');
    query.include('author.avatar');
    query.include('images');
    query.equalTo('channel', $rootScope.currentChannel);
    query.find().then(function (holes) {
      $scope.holes = holes;
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  function checkNotification() {
    var query = new AV.Query(Notification);
    query.equalTo('toUser', AV.User.current());
    query.count().then(function (count) {
      $scope.$apply(function () {
        $scope.hasNotification = count > 0;
      });
    });
  }

  function refreshList() {
    $rootScope.showLoadingPage = true;
    retrieveHoles(function () {
      $rootScope.showLoadingPage = false;
      $scope.$apply();
    });
  }

  $scope.user = AV.User.current();
  $scope.holes = [];

  retrieveChannels(refreshList);
  checkNotification();

  var push = AV.push({ appId: CONFIG.appId,  appKey: CONFIG.appKey });
  push.open();
  push.subscribe('notification_' + AV.User.current().getObjectId());
  push.on('message', function (data) {
    if (data._channel === 'notification_' + AV.User.current().getObjectId() && data.action === 'checkNotification') {
      checkNotification();
    }
  });

  $scope.pullToRefresh = function ($done) {
    $timeout(function () {
      retrieveHoles($done);
    }, 500);
  };

  $scope.switchChannel = function (channel) {
    $rootScope.currentChannel = channel;
    $scope.holes = [];
    refreshList();
  };

  $scope.refreshList = refreshList;
  $scope.checkNotification = checkNotification;
};
